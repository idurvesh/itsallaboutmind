// POST /api/publish/  — create or edit a blog post.
//
// The pipeline, the status codes and every response shape come from publish-kit,
// the same package gta6nerd uses. Only three things are this site's own, and all
// three are visible below: the gate list, the thresholds in it, and storage.
//
// TRAILING SLASH: this file answers both /api/publish and /api/publish/.
//
// Sibling route: GET|DELETE /api/publish/{slug}/.
//
// The full contract is in publish-kit's README. Two things worth repeating here
// because each has cost a debugging session elsewhere in the portfolio:
//
//   - A 4xx never touches GitHub. Only a body that passes every gate reaches the
//     Contents API, which is why a short body returns instantly and a full
//     article takes seconds. That is not a size or CPU limit.
//   - A 200 means COMMITTED, not live. This is a prerendered Astro site, so the
//     page appears after the Pages build finishes, a couple of minutes later.
import {
  createPublishHandler,
  htmlGate,
  contentGate,
  categoryGate,
  maxPerDay,
  dayWindow,
  UTC_OFFSET,
} from "publish-kit";
import {
  CATEGORIES,
  MIN_WORDS,
  DEFAULT_MAX_PER_DAY,
} from "../../../src/lib/publish-gates.mjs";
import { githubStorage, repoFor } from "../../../src/lib/publish-storage-github.mjs";

// Re-exported for the sibling [slug] route, which reads and deletes a file
// directly and has no use for the publish pipeline.
export { repoFor };

export async function onRequest({ request, env }) {
  const handle = createPublishHandler({
    token: env.PUBLISH_TOKEN,
    storage: githubStorage(env),

    // THE PIPELINE, in the order it runs. Composed here rather than hidden in
    // the package, so the order is reviewable in one place.
    gates: [
      // Before the length check: markdown or raw prose in contentHtml would
      // otherwise be counted as words and pass a gate it should never reach.
      htmlGate(),
      // MIN_WORDS is 600, MEASURED against this site's corpus (shortest live
      // post 1056 words). See publish-gates.mjs for the reasoning, and do not
      // move the number into publish-kit.
      contentGate({ minWords: MIN_WORDS }),
      categoryGate({ categories: CATEGORIES }),
    ],

    maxPerDay: maxPerDay(env, DEFAULT_MAX_PER_DAY),
    // The editorial day is UTC here. This site has no single local audience the
    // way MahaBhartiLive does (IST), so UTC is the honest choice rather than
    // pretending to a timezone.
    dayStart: () => dayWindow(UTC_OFFSET).start,
    nextDayStart: () => dayWindow(UTC_OFFSET).next,
  });

  return handle(request);
}
