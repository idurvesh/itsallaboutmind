// GET    /api/publish/{slug}/   — current post state, for diff-before-edit
// DELETE /api/publish/{slug}/   — remove the post
//
// Both Bearer PUBLISH_TOKEN, the same secret as POST /api/publish/.
//
// GET exists so an editing agent can read what is already published before
// rewriting it. Without it the only way to "edit" is to regenerate blind, which
// is how a correction silently drops the fields it was not thinking about.
import { slugify } from "../../../src/lib/publish-gates.mjs";
import { parseFrontmatter } from "../../../src/lib/frontmatter.mjs";
import { repoFor } from "./index.js";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

// Fail closed on an unset secret: without the first check, an environment
// missing PUBLISH_TOKEN would compare "" === "" and authorise everyone.
function authed(request, env) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return !!env.PUBLISH_TOKEN && token === env.PUBLISH_TOKEN;
}

export async function onRequest({ request, env, params }) {
  if (!authed(request, env)) return json({ ok: false, error: "unauthorized" }, 401);

  const repo = repoFor(env);
  const ready = repo.ready();
  if (!ready.ok) return json({ ok: false, error: "server_misconfigured", detail: ready.detail }, 500);

  const slug = slugify(params.slug || "");
  if (!slug) return json({ ok: false, error: "slug is required" }, 400);

  let file;
  try {
    file = await repo.getFile(slug);
  } catch (e) {
    // The detail carries the actual cause (expired token, missing branch, a
    // repo the PAT cannot see). A bare 502 here once read as a Worker CPU limit
    // on another site and sent a session chasing one.
    return json({ ok: false, error: "repo_read_failed", detail: String(e.message || e) }, 502);
  }
  if (!file) return json({ ok: false, error: "not_found", slug }, 404);

  if (request.method === "GET") {
    const { data, body } = parseFrontmatter(file.content);
    return json({
      ok: true,
      slug,
      url: `/blog/${slug}/`,
      branch: repo.branch,
      title: data.title ?? null,
      description: data.description ?? null,
      category: data.category ?? null,
      pubDate: data.pubDate ?? null,
      readTime: data.readTime ?? null,
      author: data.author ?? null,
      coverImage: data.coverImage ?? null,
      contentHtml: body,
    });
  }

  if (request.method === "DELETE") {
    try {
      await repo.deleteFile(slug, `blog: remove ${slug}`, file.sha);
    } catch (e) {
      return json({ ok: false, error: "delete_failed", detail: String(e.message || e) }, 502);
    }
    // Same caveat as publishing: the file is gone from the branch, but the page
    // stops serving only once the next build deploys.
    return json({
      ok: true,
      deleted: true,
      slug,
      branch: repo.branch,
      note: `removed from ${repo.branch}; the page stops serving after the Pages build finishes`,
    });
  }

  return json({ ok: false, error: "method_not_allowed" }, 405);
}
