# It's All About Mind content loop

You are running unattended. Nobody will answer a question. If something is
genuinely blocking, log it and exit cleanly rather than guessing.

Your job this run: publish ONE post if the schedule owes one, or record that
nothing is owed.

## Resume a held post before writing a new one

**First thing each run, check for a held draft branch.** When a previous run wrote
a post but could not finish it (usually a failed hero image), it commits the post
to a `content-draft/<slug>` or `blog-draft/<slug>` branch and exits. That post is
NOT on the trunk, so a naive `ls` of the content directory will not see it, and you
would rewrite it from scratch. Do not.

    git branch -a --list "*content-draft/*" --list "*blog-draft/*"

Ignore any branch whose name contains `test-`: those are test artifacts.

If a non-test draft branch exists for a target that is still unpublished:
1. Check it out and see what is missing, which is almost always just the image.
2. Finish only the missing part.
3. Run the build if this site has one, then merge the branch into the trunk and
   push, exactly as a normal publish.
4. Say in your report that you resumed a held post rather than writing a new one,
   and count it against this run's one-post budget.

Only write a brand-new post when there is no resumable held draft.

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

## Concurrency: do not check for other running instances

The wrapper holds an exclusive per-site lock before you start, so you are the only
run for this site. **Do not inspect the process list to look for sibling runs, and
never defer because you saw one.**

You WILL see `run-content-loop.sh` and a `claude` process that look like a
concurrent job. Those are your own parent wrapper and your own process. On
2026-08-11 the Appyone run mistook exactly those for a rival, deferred, and lost a
publishing day for no reason.

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

## Hero image: MANDATORY, no exceptions

**Every post ships with a hero image. A post without one does not get published.**
This is a standing founder rule as of 2026-08-10.

Generate it with the shared helper, which is the only supported path. Do not call
TopView or FAL directly, and do not invent a model name:

```
bash /Users/durveshnaik/Documents/Claude/Projects/_HQ/playbooks/gen-blog-image.sh \
  --engine fal \
  --slug <slug> \
  --out-dir public/images/blog \
  --width 1200 --height 630 \
  --prompt "<your image prompt>"
```

It writes `<slug>.jpg` at exactly 1200x630 plus a matching `.webp`, and leaves a
`<slug>-src.*` original beside them. Commit the jpg and webp. The `-src` file is
scratch; gitignore it or leave it uncommitted.

**Before writing the prompt, look at an existing post in this repo** and match its
hero/OG convention exactly: the same directory, the same filename pattern, and the
same frontmatter or `<head>` field name. Do not invent a new path. If existing
posts have no hero image at all, use the path above and say so in your report.

Writing the image prompt:
- Describe a scene or an abstract composition, on-brand for this site.
- **Never ask for text, words, numbers, logos, or UI in the image.** Diffusion
  models garble lettering and a hero with mangled words is worse than a plain one.
  The helper already suppresses this, do not fight it.
- Leave visual breathing room; these get cropped and overlaid.
- No real people's faces, no recognisable brand marks.

Handling failure:
- Exit 0 means you have a verified image. Reference it and continue.
- **Exit 2 means credentials are broken.** Report it loudly in the ops log and in
  your summary. Do not publish a post with a missing image reference.
- Exit 1 means generation failed after retries. Retry once with a simpler, more
  abstract prompt. If it fails again, do NOT publish: leave the post written and
  committed on a draft branch, log why, and exit. Publishing nothing is fine.
  Publishing a post with a broken image is not.
- Note in the ops log which engine actually produced the image. `fal` is the
  preferred engine for this site. TopView was fixed on 2026-08-10 (the key and
  UID must be a matching pair) and is working, but the helper still falls back to
  FAL if it fails, so record what really ran rather than assuming.

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
