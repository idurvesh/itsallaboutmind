# It's All About Mind — Content & Keyword Tracking

Source: Google Keyword Planner export (May 2025 - Apr 2026, India locale) + manual long-tail extension.

## How to use this doc with Claude

Each day, say: **"Write today's post: Day [X]"** (or just say the next undone day number).

Claude should:
1. Find the row for that day below
2. Write the post in `src/content/blog/` following the style of existing posts (simple grade-5 language, real/emotional/funny stories, internal links to the relevant quiz, SEO frontmatter filled in)
3. Run `npm run build` to verify
4. Commit and push
5. Mark the row as Done in this file (change status and check off)
6. Remind the user to hit "Submit to Search Engines" in `/admin` after deploy

---

## Top Keywords (real data, Google Keyword Planner)

| Keyword | Monthly Searches | Competition | Trend |
|---|---|---|---|
| manifestation means | 201,000 | Low | -33% |
| manifestation | 165,000 | Low | +22% |
| meditation | 110,000 | Low | -18% |
| stoicism | 60,500 | Low | Stable |
| mindset | 22,200 | Low | +23% |
| law of attraction | 22,200 | Low | -33% |
| power of attraction | 22,200 | Low | -33% |
| mindfulness meditation | 12,100 | Low | +124% |
| relaxation | 12,100 | Low | Stable |
| books on manifesting | 12,100 | High | Stable |
| manifestation examples | 9,900 | Low | +1380% |
| growth mindset | 6,600 | Low | Stable |
| stoicism philosophy | 4,400 | Low | +22% |
| manifest how to | 4,400 | Low | -33% |
| the mindset | 1,900 | Low | Stable |

## Long-Tail Keyword Clusters (extension)

| Keyword | Intent | Category | Content Angle |
|---|---|---|---|
| how to manifest love | Informational | Problem-aware | Manifest Your Person: Step-by-Step Guide |
| how to manifest money fast | Informational | Problem-aware | 5 Manifestation Money Blocks You Don't Know You Have |
| signs your manifestation is coming | Informational | Problem-aware | 7 Signs the Universe Is About to Deliver |
| daily stoic practices | Informational | Educational | 10-Minute Morning Stoic Routine |
| what is a growth mindset | Informational | Educational | Growth vs Fixed Mindset: Which One Do You Have? |
| how to start meditating | Informational | Educational | Meditation for People Who Can't Sit Still |
| vision board ideas | Transactional | Tool-comparison | 50 Vision Board Ideas That Actually Work |
| scripting manifestation method | Informational | Industry-specific | The 369 Method Explained Simply |
| stoic quotes for hard times | Informational | Trending | 10 Stoic Quotes to Read When Life Gets Hard |
| abundance mindset exercises | Informational | Problem-aware | 5 Exercises to Shift From Scarcity to Abundance |
| how to manifest a specific person | Informational | Problem-aware | High emotional search intent, big audience |
| journaling for manifestation | Transactional | Tool-comparison | Ties to affiliate journals on /resources |

---

## 30-Day Content + Quiz Calendar

Update the **Status** column as each day is completed (Done / Skipped / Rescheduled).

| Day | Status | Type | Title | Target Keyword | Silo | File |
|---|---|---|---|---|---|---|
| 1 | Done | Blog | What Is Manifestation? | what is manifestation | Manifestation | what-is-manifestation.md |
| 2 | Done | Blog | Manifestation Examples That Actually Happened | manifestation examples | Manifestation | manifestation-examples.md |
| 3 | Done | Blog | How to Manifest - Step by Step for Beginners | manifest how to | Manifestation | how-to-manifest-step-by-step.md |
| 4 | Done | Blog | How to Manifest Money Fast (5 Blocks You Don't Know You Have) | manifest money | Manifestation | how-to-manifest-money-fast.md |
| 5 | Done | Blog | How to Manifest Love - A Step-by-Step Guide | manifest love | Manifestation | how-to-manifest-love.md |
| 6 | Pending | Blog | Signs Your Manifestation Is Coming True | signs manifestation coming | Manifestation | |
| 7 | Pending | Blog | Vision Board Ideas That Actually Work (50 Examples) | vision board ideas | Manifestation | |
| 8 | Pending | Blog | The 369 Manifestation Method Explained Simply | scripting manifestation | Manifestation | |
| 9 | Pending | Blog | Law of Attraction for Beginners (refresh existing) | law of attraction | Law of Attraction | law-of-attraction-beginners.md |
| 10 | Pending | Blog | The Power of Attraction - What It Really Means | power of attraction | Law of Attraction | |
| 11 | Pending | Blog | Best Books on Manifesting (Affiliate Roundup) | books on manifesting | Law of Attraction | |
| 12 | Pending | Promo | Promote Manifestation Style quiz on social | - | Manifestation | |
| 13 | Pending | Blog | What Is Meditation? A Beginner's Guide | meditation | Meditation | |
| 14 | Pending | Blog | Mindfulness Meditation - Why Everyone's Searching for It | mindfulness meditation | Meditation | |
| 15 | Pending | Blog | How to Start Meditating (For People Who Can't Sit Still) | how to start meditating | Meditation | |
| 16 | Pending | Blog | Morning Meditation Routine (refresh existing) | mind meditation | Meditation | morning-meditation-routine.md |
| 17 | Pending | Blog | Meditation and Relaxation - The Real Connection | meditation and relaxation | Meditation | |
| 18 | Pending | Blog | Best Guided Meditation Practices for Beginners | guided meditation | Meditation | |
| 19 | Pending | Blog | What Is Stoicism? A Simple Guide for Modern Life | stoicism | Stoicism | |
| 20 | Pending | Blog | Stoicism Philosophy Explained in Plain English | stoicism philosophy | Stoicism | |
| 21 | Pending | Blog | Daily Stoic Practices That Change Your Life | daily stoic practices | Stoicism | |
| 22 | Pending | Blog | Stoic Quotes for Hard Times (10 to Remember) | stoic quotes | Stoicism | |
| 23 | Pending | Quiz | Launch "How Stoic Are You?" quiz | stoicism quiz | Stoicism | src/pages/quiz/stoic-type.astro |
| 24 | Pending | Blog | Meditations by Marcus Aurelius - Key Lessons | meditations marcus aurelius | Stoicism | |
| 25 | Pending | Blog | What Is a Growth Mindset? (Growth vs Fixed) | growth mindset | Mindset | |
| 26 | Pending | Blog | Abundance Mindset vs Scarcity Mindset | abundance mindset | Mindset | |
| 27 | Pending | Blog | How to Build a Growth Mindset (5 Exercises) | growth mindset exercises | Mindset | |
| 28 | Pending | Blog | What's Your Mindset Type? (refresh + repromote quiz) | mindset type | Mindset | |
| 29 | Pending | Blog | Conscious Living - What It Actually Means Day to Day | conscious living | Conscious Living | |
| 30 | Pending | Blog | How to Know Your Manifestation Style (quiz recap roundup) | manifestation style | Manifestation | |

---

## Recommended Content Mix
- 60% educational (topical authority across all 4 silos)
- 25% problem-aware (money, love, signs - higher email conversion)
- 10% quiz-adjacent (promote/refresh quizzes)
- 5% affiliate roundups (books, journals)

## Style Rules for Every Post
- Grade 5 reading level - simple words, short sentences
- Include real/emotional/funny stories, not just facts
- Indian + global names and context mixed
- End with a CTA linking to the relevant quiz (`/quiz/mindset-type` or `/quiz/manifestation-style`)
- Fill SEO frontmatter: seoTitle, seoDescription, focusKeyword
- No em dashes anywhere
- After publishing, remind user to hit "Submit to Search Engines" in `/admin`
