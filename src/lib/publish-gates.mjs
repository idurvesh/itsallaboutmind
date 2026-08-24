// This site's PUBLISHING POLICY. Everything editorial lives here; the pipeline,
// the status codes and the response shapes come from publish-kit.
//
// The split matters: publish-kit is shared with gta6nerd and MahaBhartiLive, and
// none of the numbers below would be right for either of them. Never move one
// into the package. See publish-kit's README.

export { slugify } from "publish-kit";

/**
 * Minimum body words.
 *
 * MEASURED against this site's corpus on 2026-08-24, not picked. The 15 live
 * posts run 1056 to 2310 words, shortest is signs-manifestation-coming-true.md
 * at 1056. 600 sits at roughly 57% of the shortest thing that has ever shipped
 * here, which is the same ratio gta6nerd settled on (500 against a 949-word
 * floor).
 *
 * The gate is there to catch a HALF-FAILED generation, not to enforce an
 * editorial standard, so it belongs below anything a human would let through.
 * Set it near the corpus floor and it starts rejecting legitimate short posts;
 * set it at the specced default and it can never fire. On MahaBhartiLive a
 * specced 300 would have rejected a quarter of the live site.
 */
export const MIN_WORDS = 600;

/**
 * The categories that exist. A publish naming anything else is refused rather
 * than inventing one.
 *
 * WHY REFUSING BEATS CREATING: on MahaBhartiLive the publish path invented a
 * category when it did not recognise one, which produced an "Uncategorized"
 * archive that was excluded from nav, so every post filed there was orphaned
 * from every listing and earned no internal links. A new section is an
 * editorial decision, not something a generation run should be able to make.
 *
 * Matched case-insensitively; the gate rewrites the body to the casing here.
 */
export const CATEGORIES = ["Manifestation", "Mindset"];

/**
 * Slugs a post may never take.
 *
 * Posts render at /blog/<slug>/ (src/pages/blog/[...slug].astro), so they cannot
 * collide with the top-level pages. What they CAN collide with is the blog index
 * itself, and a post slugged "index" would produce src/content/blog/index.md,
 * which fights src/pages/blog/index.astro for /blog/. The rest are guarded
 * because they are the obvious head terms someone would generate an article for,
 * and a post on the bare term would cannibalise the section that already owns it.
 */
export const RESERVED_SLUGS = [
  "index",
  "blog",
  "about",
  "resources",
  "quiz",
  "manifestation",
  "mindset",
];

/**
 * Default cap on NEW posts per day. Overridable per environment with
 * PUBLISH_MAX_PER_DAY; 0 disables it.
 *
 * Deliberately low. This site publishes long researched pieces, not a news
 * feed, and the cap exists so a runaway loop cannot bury the archive overnight.
 * It only ever restricts CREATING: editing an existing post is always allowed,
 * because refusing an edit strands a correction that is already public.
 */
export const DEFAULT_MAX_PER_DAY = 2;
