# It's All About Mind — quiz blog content loop

You are running unattended. Nobody will answer a question. If something is
genuinely blocking, log it and exit cleanly rather than guessing.

Your job this run: publish ONE quiz blog post if the schedule owes one, or
record that nothing is owed.

## Concurrency: do not check for other running instances

The wrapper holds an exclusive per-site lock before you start, so you are the only
run for this site. **Do not inspect the process list to look for sibling runs, and
never defer because you saw one.**

You WILL see `run-content-loop.sh` and a `claude` process that look like a
concurrent job. Those are your own parent wrapper and your own process. On
2026-08-11 the Appyone run mistook exactly those for a rival, deferred, and lost a
publishing day for no reason.

## Resume a held draft before writing a new one

**First thing each run, check for a held draft branch.**

    git branch -a --list "*content-draft/*" --list "*blog-draft/*"

Ignore branches whose name contains `test-`. If a non-test draft branch exists
for a slug not yet in `src/content/blog/`:

1. Check it out and see what is missing (usually the hero image).
2. Finish only the missing part.
3. Run `npm run build`, merge the branch into `main`, push.
4. Count it as this run's one-post budget. Stop.

Only write a brand-new post when there is no resumable held draft.

## Weekly cap

Count `.mdx` files in `src/content/blog/` whose `pubDate` falls in the current
ISO calendar week. If that count is already **3**, log "weekly cap reached" and
exit without writing.

## Pick the quiz topic

There is no pre-existing schedule. Choose the topic with the highest SEO potential
from this prioritized list — pick the first one that has not yet been published.
Focus keywords and estimated monthly search volumes (India, from keyword research) are noted:

1. "How Strong Is Your Memory?" — slug: `how-strong-is-your-memory` — keyword: `memory quiz` (~25k/mo, low competition)
2. "Are You Left Brain or Right Brain?" — slug: `left-brain-right-brain-test` — keyword: `left brain right brain test` (~30k/mo, low competition)
3. "What Type of Thinker Are You?" — slug: `what-type-of-thinker-are-you` — keyword: `brain quiz` (~18k/mo, low competition)
4. "What's Your Stress Response?" — slug: `whats-your-stress-response` — keyword: `stress quiz` (~12k/mo, low competition)
5. "How Emotionally Intelligent Are You?" — slug: `how-emotionally-intelligent-are-you` — keyword: `emotional intelligence test` (~10k/mo, low competition)
6. "What's Your Focus Style?" — slug: `whats-your-focus-style` — keyword: `focus test` (~8k/mo, low competition)
7. "How Mindful Are You Really?" — slug: `how-mindful-are-you` — keyword: `mindfulness quiz` (~5k/mo, low competition)
8. "What's Your Growth Mindset Score?" — slug: `growth-mindset-quiz` — keyword: `growth mindset quiz` (~4k/mo, low competition)
9. "What's Your Decision-Making Style?" — slug: `whats-your-decision-making-style` — keyword: `decision making quiz` (~3k/mo, low competition)
10. "How Creative Is Your Brain?" — slug: `how-creative-is-your-brain` — keyword: `creativity test` (~6k/mo, low competition)
11. "What's Your Mental Resilience Score?" — slug: `whats-your-mental-resilience-score` — keyword: `resilience quiz` (~3k/mo, low competition)
12. "What's Your Brain Age?" — slug: `whats-your-brain-age` — keyword: `brain age test` (~5k/mo, low competition)
13. "What's Your Attention Span?" — slug: `attention-span-test` — keyword: `attention span test` (~6k/mo, low competition)
14. "Are You an Introvert, Extrovert, or Ambivert?" — slug: `introvert-extrovert-ambivert-quiz` — keyword: `introvert extrovert quiz` (~15k/mo, medium competition)
15. "How Good Are You at Reading People?" — slug: `how-good-are-you-at-reading-people` — keyword: `reading people quiz` (~3k/mo, low competition)

Note: volumes are estimates from keyword research (India, 2025-2026). Treat them as directional priority, not exact figures.

Check `ls src/content/blog/` and pick the first unpublished slug from this list.
Set `pubDate` to **today's actual date**.

## Write the quiz post

This is an Astro site with MDX enabled. Quiz posts live in
`src/content/blog/<slug>.mdx`.

### Frontmatter

```
---
title: "<quiz title>"
description: "<1-2 sentence description, include the focus keyword>"
pubDate: <today's date YYYY-MM-DD>
category: "Quiz"
readTime: "<N> min"
author: "It's All About Mind"
featured: false
coverImage: "/images/<slug>.jpg"
coverImageAlt: "<descriptive alt text>"
ogImage: "/images/<slug>.jpg"
seoTitle: "<title | It's All About Mind>"
seoDescription: "<155 chars max, includes focus keyword>"
focusKeyword: "<primary keyword e.g. 'memory quiz'>"
---
```

### Intro (markdown)

2-3 short paragraphs in the site's voice:
- Open with a specific person in a specific moment (a named individual, a scene).
- Pivot to the quiz theme.
- No promises. No medical advice. No income claims.

### The quiz (inline HTML + vanilla JS inside MDX)

5-8 multiple-choice questions. Each question has 4 options (A/B/C/D). Each option
has a hidden point value (1–4). After all questions, a "See My Result" button
calculates the total score and reveals a score-band result.

Implement as a `<div id="quiz-container">` block with a `<script>` tag. Use only
vanilla JavaScript — no React, no framework, no imports. Keep the JS minimal and
readable. Style with inline CSS or a `<style>` tag. Do not use external assets
except Google Fonts via `@import` in a `<style>` tag.

Score bands: divide the score range into 3 result tiers. Example for 6 questions
× 4 max points = 24 max: low 6–12, mid 13–18, high 19–24. Label each tier with a
memorable result type (e.g., "Visual Memory Ace", "Steady Recall", "Memory in
Progress").

### Result explanations (markdown)

After the quiz `<div>`, write 3–4 paragraphs of markdown prose explaining each
result type in depth. Same voice rules: short paragraphs, short sentences, no em
dashes, no invented research.

### Closing (markdown)

1–2 paragraphs. Internally link to 2–3 related existing posts in
`src/content/blog/` AND to a relevant quiz page from `src/pages/quiz/` (check what
quiz pages exist). This site's quizzes are its only email-capture asset — offer
one naturally.

## Non-negotiables

- **No em dashes.** Scan for `—` and `–` before committing.
- **Short paragraphs:** 2–5 sentences max. **Short sentences:** 5–10 words max.
- **Every heading sentence-case** (first word capitalised only, unless proper noun).
- **No invented research.** Do not cite a study or statistic you have not verified.
- **No medical or income claims.** No "this will heal you", no earnings implications.
- **No made-up testimonials.** Names in stories are illustrative, not testimonials.
- `author` is always `"It's All About Mind"`.

## Hero image: HyperFrames (mandatory)

**Every post ships with a hero image. A post without one does not get published.**

Use HyperFrames — NOT FAL, NOT TopView, NOT any AI image model.

Steps:

1. Create `design/blog-images/compositions/<slug>.html`. Requirements:
   - Fixed `<html>` element exactly 1200×630 px (set via inline style or CSS).
   - Dark background; bold typography.
   - No external network calls except Google Fonts via CSS `@import`.
   - Design to match the quiz theme: brain imagery, question marks, a score gauge,
     or similar. Use deep indigo/violet tones or calming teal/sage — match the
     site's mindfulness vibe.
   - The HTML must be self-contained and renderable offline.

2. Render it:
   ```
   cd /home/opc/projects/itsallaboutmind/design/blog-images && \
     node render.js compositions/<slug>.html ../../public/images/<slug>.jpg
   ```

3. Verify: `ls -lh ../../public/images/<slug>.jpg` — file must be > 10 KB.
   If the file is missing or ≤ 10 KB, do NOT publish. Commit the post to a
   `content-draft/<slug>` branch and exit, logging the failure.

4. Reference in frontmatter as `coverImage: "/images/<slug>.jpg"` and
   `ogImage: "/images/<slug>.jpg"`.

Do NOT run the HyperFrames render during this initial setup run. The render pipeline
will be tested on the first cron run.

## Build, publish, deploy

1. Run `npm run build` and confirm it passes. If it fails, fix it or revert. Never
   commit a broken build.
2. Commit to `main`.
3. Push `main`. **This site deploys via Cloudflare Pages on git push to `main`.**
   Do NOT run wrangler.
4. After the push, confirm the push succeeded. Do not wait for the CDN to warm.

## Ops log

Append a dated entry to `docs/ops/content-loop-log.md` (create it if absent):
date · slug · topic · word count · focus keyword · internal links · build result ·
push result.

If this is the first quiz post, also append a list of 5 suggested quiz slugs for
future runs.

Commit the ops log update and push it, even on a run where nothing was owed.
A silent run is indistinguishable from a dead job.
