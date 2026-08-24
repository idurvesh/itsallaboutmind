// This site's storage adapter for publish-kit.
//
// The pipeline, status codes and response shapes come from publish-kit; this
// file is the ONLY part specific to how this site stores a post.
//
// WHY A COMMIT AND NOT A ROW: this is a fully prerendered Astro build.
// src/pages/blog/[...slug].astro uses getStaticPaths(), so every post page is
// generated at build time from the markdown in src/content/blog/. Nothing runs
// at request time that could read a database, so the stored form of a post IS a
// file in the repo, and the only way a Pages Function can add one is the GitHub
// Contents API.
//
// Two consequences, and both should be told to whoever operates the publisher:
//   - Publishing is NOT instant. Commit -> Pages build -> deploy is a couple of
//     minutes, so a 200 means "committed, build queued", not "live".
//   - A bad commit fails the BUILD, which blocks the next deploy of the whole
//     site. Hence every gate before the commit, never after.

import { GitHubRepo, slugify } from "publish-kit";
import { buildMarkdown, parseFrontmatter } from "./frontmatter.mjs";
import { RESERVED_SLUGS } from "./publish-gates.mjs";

const HOST = "itsallaboutmind.com";

/**
 * The repo handle on its own.
 *
 * Exported separately because GET and DELETE /api/publish/{slug}/ read and
 * delete a file directly and have no use for the publish pipeline: they want
 * getFile/deleteFile, not a PublishStorage.
 */
export function repoFor(env) {
  return new GitHubRepo({
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_OWNER || "idurvesh",
    repo: env.GITHUB_REPO || "itsallaboutmind",
    // Defaults to main so a publish auto-deploys. Set PUBLISH_BRANCH to a draft
    // branch to route an autonomous publisher through human review instead.
    branch: env.PUBLISH_BRANCH || "main",
    path: "src/content/blog",
    extension: ".md",
    userAgent: "itsallaboutmind-publish-endpoint",
    secretHint: "wrangler pages secret put GITHUB_TOKEN --project-name itsallaboutmind",
  });
}

export function githubStorage(env) {
  const repo = repoFor(env);

  // The handler asks "does this exist?" and then "save it", and both need the
  // same file: the sha to update it, and its frontmatter so an edit cannot drop
  // the original pubDate. Reading twice would spend a second GitHub subrequest
  // for nothing, and subrequests are a hard per-invocation budget on Workers,
  // so memoise the read for the life of this request.
  const reads = new Map();
  const read = async (slug) => {
    if (!reads.has(slug)) reads.set(slug, await repo.getFile(slug));
    return reads.get(slug);
  };

  return {
    check: () => repo.ready(),

    /**
     * Refuse a reserved slug rather than renaming it.
     *
     * NEVER a rename: appending a suffix on a collision is how MahaBhartiLive
     * ended up with /talathi-bharti-update/ competing against the
     * /talathi-bharti/ pillar on its single best keyword. A second page on the
     * same term is worse than no page.
     */
    async resolveSlug(raw) {
      const slug = slugify(raw);
      if (!slug) return { ok: false, slug, reason: "slug is empty after slugify" };
      if (RESERVED_SLUGS.includes(slug)) {
        return {
          ok: false,
          slug,
          reason: `/blog/${slug}/ is a reserved route or a section head term; a post on the same term would cannibalise it`,
        };
      }
      return { ok: true, slug };
    },

    async exists(slug) {
      return (await read(slug)) !== null;
    },

    async countCreatedSince(since) {
      return repo.commitsSince(since.toISOString());
    },

    async save({ slug, body, exists }) {
      const existing = exists ? await read(slug) : null;
      const previous = existing ? parseFrontmatter(existing.content).data : {};

      const markdown = buildMarkdown({
        previous,
        title: body.title,
        description: body.description,
        category: body.category,
        readTime: body.readTime,
        coverImage: body.coverImage,
        coverImageAlt: body.coverImageAlt,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        focusKeyword: body.focusKeyword,
        ogImage: body.ogImage,
        canonicalUrl: body.canonicalUrl,
        author: body.author,
        featured: body.featured,
        body: body.contentHtml,
      });

      const message = existing
        ? `blog: update ${slug}`
        : `blog: publish ${slug}`;

      const { commit } = await repo.putFile(slug, markdown, message, existing?.sha);

      return {
        created: !existing,
        url: `https://${HOST}/blog/${slug}/`,
        commit,
        branch: repo.branch,
        // Said plainly in the response because it is the single most common
        // misunderstanding of a file-based publish: 200 is not "live".
        note: `committed to ${repo.branch}; the page goes live after the Pages build finishes`,
      };
    },
  };
}
