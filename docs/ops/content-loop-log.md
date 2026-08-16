# Content Loop Log

Liveness record for the It's All About Mind daily content loop. One dated entry
per run, even when nothing is owed. The remote copy is the proof the job is alive.

---

## 2026-08-16

- Held-draft check: only `content-draft/test-2026-08-10-369-manifestation-method`
  exists, a `test-` artifact, so it is ignored. No resumable held draft.
- Weekly cap reached: 3 posts already carry a `pubDate` in the current calendar
  week (Mon 2026-08-10 to Sun 2026-08-16):
  `369-manifestation-method` (2026-08-11), `law-of-attraction-for-beginners`
  (2026-08-12), and `power-of-attraction` (2026-08-13). The real cadence is 2 to 3
  posts per week and the cap is 3, so no post was written this run. This is the
  third consecutive cap-reached run (after 2026-08-14 and 2026-08-15); the week
  rolls over Monday 2026-08-17, so the next run is clear to publish.
- Row chosen: none. The oldest uncovered row is Part A Day 11 (Best Books on
  Manifesting), but the two highest-volume untouched targets to prioritise next
  week are `meditation` (Day 13, 110,000/mo per the plan) and the missing
  `manifestation means` pillar (201,000/mo).
- Build: not run (nothing written).
- Live URL status: n/a.
- Result: **no post owed / weekly cap reached**. Loop is alive; exited cleanly.

---

## 2026-08-15

- Held-draft check: only `content-draft/test-2026-08-10-369-manifestation-method`
  exists, a `test-` artifact, so it is ignored. No resumable held draft.
- Weekly cap reached: 3 posts already carry a `pubDate` in the current calendar
  week (Mon 2026-08-10 to Sun 2026-08-16):
  `369-manifestation-method` (2026-08-11), `law-of-attraction-for-beginners`
  (2026-08-12), and `power-of-attraction` (2026-08-13). The real cadence is 2 to 3
  posts per week and the cap is 3, so no post was written this run. This is the
  second consecutive cap-reached run (after 2026-08-14); the week rolls over Monday
  2026-08-17.
- Row chosen: none. The oldest uncovered row is Part A Day 11 (Best Books on
  Manifesting), but the two highest-volume untouched targets to prioritise next
  week are `meditation` (Day 13, 110,000/mo per the plan) and the missing
  `manifestation means` pillar (201,000/mo).
- Build: not run (nothing written).
- Live URL status: n/a.
- Result: **no post owed / weekly cap reached**. Loop is alive; exited cleanly.

---

## 2026-08-14

- Held-draft check: only `content-draft/test-2026-08-10-369-manifestation-method`
  exists, a `test-` artifact, so it is ignored. No resumable held draft.
- Weekly cap reached: 3 posts already carry a `pubDate` in the current calendar
  week (Mon 2026-08-10 to Sun 2026-08-16):
  `369-manifestation-method` (2026-08-11), `power-of-attraction` (2026-08-12),
  and `law-of-attraction-for-beginners` (2026-08-13). The real cadence is 2 to 3
  posts per week and the cap is 3, so no post was written this run.
- Row chosen: none. Next oldest uncovered high-volume targets remain
  `meditation` (110,000/mo) and the `manifestation means` pillar (201,000/mo) for
  the next run once the week rolls over.
- Build: not run (nothing written).
- Live URL status: n/a.
- Result: **no post owed / weekly cap reached**. Loop is alive; exited cleanly.

---

## 2026-08-13

- Held-draft check: only `content-draft/test-2026-08-10-369-manifestation-method`
  exists, a `test-` artifact, so it is ignored. No resumable held draft, so a
  brand-new post was written.
- Row chosen: Part A, Day 10 (oldest uncovered row). Original date 2026-07-22.
  Also one of the highest-volume untouched targets in the plan.
- Title: The Power of Attraction - What It Really Means
- Slug: `power-of-attraction`
- Focus keyword: `power of attraction` (schedule lists 22,200/mo; treated as the
  plan's figure, not stated as fact on the page). Deliberately framed as the felt
  magnetism / pull, distinct from the Day 9 `law of attraction` mechanism post, to
  avoid cannibalising it.
- Word count: ~2,040
- Weekly cap: 2 posts had a pubDate in the current week (Mon 2026-08-10 to Sun
  2026-08-16) before this run (369-manifestation-method 2026-08-11,
  law-of-attraction-for-beginners 2026-08-12). Cap of 3 not reached. This is post 3
  of the week, so the cap is now met; no further posts should ship until 2026-08-17.
- Internal links: 4 posts (law-of-attraction-for-beginners, what-is-manifestation,
  how-your-beliefs-shape-your-reality, how-to-manifest-step-by-step) plus the
  Manifestation Style quiz.
- Hero image: generated via the shared helper, engine `fal` (`fal-ai/flux/dev`),
  exit 0. Verified 1200x630 jpg + webp at
  `public/images/power-of-attraction.{jpg,webp}`. Matched the existing repo
  convention (`/images/<slug>.<ext>` via `coverImage`/`ogImage`).
- Social card: no fix needed; the site-wide fix from 2026-08-11 is in place.
  Verified live: `og:type=article` and `og:image` both set to the hero.
- llms.txt: added the new post to the `## Articles` list.
- Build: `npm run build` passed, 18 pages, new route generated.
- Live URL status: **200 OK**, verified serving the real post. As prior entries
  warned, the non-slash path 308-redirects and unknown paths fall back to Home with
  a 200, so I verified by matching the post title at the canonical trailing-slash
  URL, not by status code alone.
  Live: https://itsallaboutmind.com/blog/power-of-attraction/
- Indexing: submitted the verified live URL via `submit-indexing.sh`. Both channels
  succeeded: IndexNow `itsallaboutmind.com: OK (200)`; Google `URL_UPDATED, 1/1 ok,
  quota today 1/200`. Note for future runs: the wrapper looked like it hung for ~10
  min with an empty output file. It had not. `submit-indexing.sh` starts a
  long-lived indexing-tool server (port 4747) in the background, and that daemon
  keeps the `| tail -30` pipe's write end open, so tail never sees EOF until the
  parent is signalled even though all submission work finished immediately. If this
  recurs, the submission has almost certainly already succeeded; do not re-submit.
- Result: **published**. Commit 34d4615 on main.

---

## 2026-08-12

- Held-draft check: only `content-draft/test-2026-08-10-369-manifestation-method`
  exists, which is a `test-` artifact and ignored. No resumable held draft, so a
  brand-new post was written.
- Row chosen: Part A, Day 9 (oldest uncovered row). Original date 2026-07-21.
  Also the highest-volume untouched target called out in the prompt.
- Title: Law of Attraction for Beginners
- Slug: `law-of-attraction-for-beginners`
- Focus keyword: `law of attraction` (schedule lists 22,200/mo; treated as the
  plan's figure, not stated as fact on the page).
- Word count: ~2,030
- Weekly cap: 1 post had a pubDate in the current week (Mon 2026-08-10 to Sun
  2026-08-16) before this run (369-manifestation-method, 2026-08-11). Cap of 3
  not reached. This is post 2 of the week.
- Internal links: 4 posts (what-is-manifestation, how-your-beliefs-shape-your-reality,
  vision-board-ideas, how-to-manifest-step-by-step) plus the Manifestation Style
  quiz (linked twice).
- Hero image: generated via the shared helper, engine `fal` (`fal-ai/flux/dev`),
  exit 0. Verified 1200x630 jpg + webp at
  `public/images/law-of-attraction-for-beginners.{jpg,webp}`. Matched the existing
  repo convention (`/images/<slug>.<ext>` via `coverImage`/`ogImage`).
- Social card: no fix needed; the site-wide fix from 2026-08-11 is in place.
  Verified live: `og:type=article`, `og:image` and `twitter:image` both set to the
  hero.
- llms.txt: added the new post to the `## Articles` list.
- Build: `npm run build` passed, 17 pages, new route generated.
- Live URL status: **200 OK**, verified serving the real post. As the prior entry
  warned, unknown paths on this host 308-redirect / fall back to Home, so I verified
  by matching the post title and the "Nikhil" intro in the HTML at the canonical
  trailing-slash URL, not by status code alone.
  Live: https://itsallaboutmind.com/blog/law-of-attraction-for-beginners/
- Indexing: submitted the verified live URL via `submit-indexing.sh`. The IndexNow
  channel is instant; the Google Indexing API channel starts the local indexing-tool
  server, which was very slow to return this run (script still running, output
  buffered, at time of writing). Per the standing rule, indexing never fails the run
  and the sitemap is the backstop, so the run was finalized without blocking on it.
- Result: **published**. Commit on main (see `Add Law of Attraction for Beginners
  post`).

---

## 2026-08-11

- Row chosen: Part A, Day 8 (oldest uncovered row). Original date 2026-07-20.
- Title: The 369 Manifestation Method Explained Simply
- Slug: `369-manifestation-method`
- Focus keyword: `369 manifestation method`
- Word count: ~1,880
- Weekly cap: 0 posts had a pubDate in the current week (Mon 2026-08-10 to Sun
  2026-08-16) before this run, so the cap of 3 was not reached. This is post 1.
- Internal links: 5 posts (what-is-manifestation, vision-board-ideas,
  how-to-manifest-step-by-step, how-to-manifest-money-fast,
  signs-manifestation-coming-true) plus the Manifestation Style quiz (linked twice).
- Hero image: generated via the shared helper, engine `fal`
  (`fal-ai/flux/dev`), exit 0. Verified 1200x630 jpg + webp at
  `public/images/369-manifestation-method.{jpg,webp}`. Matched the existing repo
  convention (`/images/<slug>.<ext>` referenced from `coverImage`/`ogImage`), not
  the `blog/` subdir suggested in the prompt, because every existing post already
  uses `public/images/`.
- Social-card fix (done once, site-wide): `BaseLayout.astro` now takes an
  `ogType` prop (default `website`) and `BlogPost.astro` passes `ogType="article"`
  and falls back to `coverImage` for the OG/Twitter image when `ogImage` is unset.
  Verified in built HTML: `og:type=article`, `og:image` and `twitter:image` present.
- llms.txt: added an `## Articles` link section (standard llms.txt pattern) listing
  all 9 published posts, including the new one. The file previously had no per-post
  list.
- Build: `npm run build` passed, 16 pages, new route generated.
- Live URL status: **200 OK**, verified serving the real post.
  https://itsallaboutmind.com/blog/369-manifestation-method/ returns the correct
  title and `og:type=article` with `og:image`/`twitter:image` set. Deploy landed
  ~2 min after push (Cloudflare Pages git integration, no wrangler). Note for future
  runs: unknown paths on this site return HTTP 200 serving the Home page, so verify
  by matching the post title in the HTML, not by status code alone.
- Result: **published**. Commit e32d264 on main.
