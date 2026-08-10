# It's All About Mind content loop

You are running unattended. Nobody will answer a question. If something is
genuinely blocking, log it and exit cleanly rather than guessing.

Your job this run: publish ONE post if the schedule owes one, or record that
nothing is owed.

## Pick the slot

The dated schedule is `_HQ/schedules/itsallaboutmind-schedule.md` (readable via
`--add-dir`). The plan is 40 posts. As of 2026-08-10 only 8 shipped and the
original dates ran 2026-07-18 onward at one per day, which was never sustained.

Rules:

1. **Take the OLDEST uncovered row**, not today's. Cross-check against
   `ls src/content/blog/` so you never duplicate a published post. This makes
   the loop self-healing: a dark week is worked off one post at a time.
2. **Ignore the original dates entirely.** They are stale and the daily cadence
   they encode is what caused the stall. The real cadence is now **two to three
   posts per week**. Before writing, count posts in `src/content/blog/` whose
   `pubDate` falls in the current calendar week. If that count is already 3,
   log "weekly cap reached" and exit without writing.
3. Set `pubDate` to **today's actual date**, never the schedule's original date.
4. Prefer the highest-volume untouched targets first. `law of attraction`
   (22,200/mo), `power of attraction` (22,200/mo), and `meditation`
   (110,000/mo) are the biggest unwritten rows. There is no pillar page for
   `manifestation means` (201,000/mo), which is the single largest gap.

## Write the post

This is an Astro site. Posts live in `src/content/blog/<slug>.md`. Clone the
frontmatter shape of `src/content/blog/how-to-manifest-love.md` exactly:

```
title, description, pubDate, category, readTime, author, featured,
coverImageAlt, seoTitle, seoDescription, focusKeyword
```

`author` is always `"It's All About Mind"`. `featured` is `false` unless this is
a pillar page.

**Voice is the whole product here.** Read two existing posts before you write.
They open with a specific person in a specific moment (a named woman, a list on
a fridge, an evening), then turn. They are warm, plain, unhurried, and they
never promise outcomes. Match that. Do not write a listicle with a
"conclusion" section.

Length: 1,500 to 2,500 words. Short paragraphs. Real, concrete scenes.

## Non-negotiables

- **Never promise a result.** This is a mindset and manifestation site, which
  makes it the easiest place in the portfolio to drift into health or income
  claims. No "this will heal you", no earnings implications, no medical advice.
  Where a claim would need evidence, hedge honestly or cut it.
- **No invented research.** Do not cite a study, statistic, or expert you have
  not verified. The audit found search-volume figures in the plan marked
  "to verify"; treat any such number as unverified and never state it as fact
  on the page.
- Names in stories are illustrative. Never present an invented person as a real
  customer or testimonial.
- **No em dashes.** Rewrite with commas, colons, or periods. Scan for `—` and
  `–` before committing.
- **Every heading starts with a capital letter** (sentence case).
- Run the `human-writing` skill as a final pass over the finished post.

## Wire it in

1. Save to `src/content/blog/<slug>.md`.
2. Internally link to 2 to 4 existing posts, and to a relevant quiz. The quizzes
   are this site's only email-capture asset, so every post should offer one
   naturally rather than dead-ending.
3. Add the post to `llms.txt` in the existing style. This portfolio has a
   standing rule that `llms.txt` updates with every content change.
4. There is a known site-wide gap: posts ship with **no `og:image` and no
   `twitter:image`**, and `og:type` is `website` instead of `article`. If you
   can fix that in the layout without risk, do it once and say so. Otherwise
   leave it and note it. Do not silently ship a post with a broken social card.

## Build, publish, deploy

1. Run `npm run build` and confirm it passes. If the build fails, fix it or
   revert cleanly. Never commit a state that does not build.
2. Commit to `main` with the standard Co-Authored-By line.
3. Push `main`. **This site has Cloudflare Pages git integration, so pushing
   `main` deploys it.** Do not run a wrangler command.
4. After the deploy settles, fetch the live post URL and confirm it returns 200
   before you consider the run done. If it does not, say so plainly.

## Finish

Append a dated entry to `docs/ops/content-loop-log.md` (create it if absent):
date, row chosen, slug, word count, focus keyword, internal links, build result,
live URL status. Commit and push it, even on a run where nothing was owed. The
remote log is the liveness record. A silent run is indistinguishable from a
dead job.
