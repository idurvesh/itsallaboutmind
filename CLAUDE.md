# itsallaboutmind

Manifestation and personal-growth SEO site for an Indian audience. Content-led, built to
rank (for example "manifestation means" is a high-volume term) and to capture email
through quizzes. Currently live but was stalled at post 5 of 30; the daily content engine
is being restarted.

## Stack

- **Astro** (static site generation) + **TinaCMS** for content editing.
- Blog posts are Markdown under `src/content/blog/`.
- Deployed on **Cloudflare** (Pages Functions). No payments today.

## Commands

```bash
npm run dev      # local dev (astro dev)
npm run build    # production build (astro build)
```

Verify changes by building and checking the affected posts render. Note: `.astro/` build
output is generated, not hand-edited (it is intentionally kept out of content commits).

## Layout

- `src/content/blog/` — Markdown blog posts (the SEO content).
- `CONTENT_PLAN.md` — the running content plan and status.
- Posting schedule lives in `_HQ/schedules/itsallaboutmind-schedule.md` (40 posts, daily cadence).

## Business model

No revenue yet. The owned asset is the quiz-based **email capture**. Recommended first
monetization: an email nurture off the existing quizzes plus one low-ticket digital
product matched to the quiz result. This converts at low traffic because the audience is
owned.

## Team & delegation

This project runs as a small executive team of subagents (in `.claude/agents/`). For
anything beyond a quick lookup or trivial edit, route to the owner instead of doing it
inline. Each agent reads this file first, so this is their source of truth.

- **`ceo`** (advisory, read-only): monetization path, whether to build the low-ticket product, prioritization to get the engine running again.
- **`cmo`** (advisory + copy/asset drafting): the daily SEO posts, keyword targeting, quiz-to-email nurture, the low-ticket offer.
- **`cto`** (writes and ships code): the Astro + TinaCMS site, publishing, quiz/email capture wiring, Cloudflare deploy.
- **`designer`** (design assets + generated media): blog/OG images and social creative (see Media pipeline). Note current posts are text-only unless a post specifies otherwise.
- **`coordinator`** (COO): runs the daily posting cadence from the schedule and delegates.

Flow: CEO/CMO set direction and copy, CTO builds, designer produces visuals.

## Media pipeline

Generated media (images, and AI video/voice) for this project goes through **FAL.ai** (`FAL_API_KEY` in the gitignored local env). The `designer` agent owns it: author motion graphics with the `hyperframes` skill and use FAL for AI images and footage. Do not use TopView or Higgsfield here.

## Guardrails

- **File references:** when you mention a file in chat, write it as a markdown relative link from the repo root so it opens in the editor. Paths inside code blocks stay plain.
- **Honest-until-real:** never fabricate stats, testimonials, or results. Mark placeholders clearly.
- **Copywriting:** load the `humanize-copy` skill for any post or customer-facing prose and run it again as a final pass. No em dashes.
- **Asking the user:** prefer plain-text questions; use the AskUserQuestion popup only for a genuine short either/or.
