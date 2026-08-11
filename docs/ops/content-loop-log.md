# Content Loop Log

Liveness record for the It's All About Mind daily content loop. One dated entry
per run, even when nothing is owed. The remote copy is the proof the job is alive.

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
- Live URL status: (recorded after push/deploy below)
