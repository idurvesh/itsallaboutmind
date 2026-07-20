# Video Pipeline (end to end)

The one place to look for how this project makes a video. The **flow is the same
for every project**; only the skin changes — brand colors/fonts, avatar persona,
script/copy, and music mood all come from `CLAUDE.md` and the marketing-context
file. Pull those from there; keep the pipeline below identical.

Default output: 9:16 1080x1920, H.264 + AAC, 30fps, `+faststart`. Generated media
goes through FAL.ai (not Higgsfield). Log models + cost of every run in a build
log (e.g. `docs/design/prompts.md`).

---

## 1. Overview / mental model

HyperFrames renders the **silent visuals**. FFmpeg does the **stitch** — it muxes
the voiceover, the ducked music bed, SFX, and (for talking-avatar videos) the
lip-synced avatar bookends into the final MP4. FAL only ever produces media
*inputs* (voiceover audio, music, the lip-synced avatar clip); it never assembles
the video.

```
brief
  -> HyperFrames scenes (HTML)                    # index.html, kinetic type + brand motion
  -> npm run check (MUST pass) -> npm run render   # silent MP4
  -> FAL: voiceover (VO) + music bed + [lip-synced avatar]   # audio + avatar inputs
  -> ffmpeg: continuous VO track + beatmap, duck music under VO, SFX, avatar bookends
  -> ffmpeg mux -> final MP4 (H.264 copied, AAC audio)
  -> verify (ffprobe: audio stream present) + human listen pass
```

Two shapes of video:
- **Motion-only / scored** — silent HyperFrames render + a ducked music bed
  (optionally VO). Cheap. Good for a daily/batch cadence.
- **Talking-avatar reel** — a lip-synced avatar intro (and sometimes outro) in a
  branded frame that cross-fades into the motion-graphics cut, over one continuous
  VO + ducked bed. The lip-sync is the expensive step.

---

## 2. Quickstart (shortest path to a finished video)

Run from repo root with `FAL_API_KEY` exported.

1. **Author scenes** in a HyperFrames project (copy your template project — §3).
   Set the scene structure, hook stamp, on-screen beats, CTA. Brand tokens
   (colors/fonts) come from `CLAUDE.md`.
2. **Generate the VO** on FAL ElevenLabs, one clip per script segment, then build
   the continuous VO track + beatmap. Draft ONE segment and check the voice before
   generating all of them.
3. **Generate the music bed** on FAL CassetteAI (copyright-safe), or reuse a
   prebuilt bed.
4. **(Talking-avatar only)** slice the intro/outro from the VO, run the OmniHuman
   lip-sync — test ONE short clip first, then do the bookends.
5. **Build the mix** — VO + ducked music + SFX into one `mix.wav`.
6. **Check + render** the silent visuals: `npm run check` (must pass) then
   `npm run render`.
7. **Mux** the audio (and avatar bookends) into the silent render with ffmpeg.
8. **Verify** with ffprobe (audio stream present, dimensions, duration) and flag a
   human listen pass.

---

## 3. HyperFrames composition (the silent visuals)

Read `/hyperframes` FIRST for any video/animation/motion request — it is the
router skill that confirms the brief and points to the right workflow. Full
project rules live in each HyperFrames project's own `CLAUDE.md`.

**Project layout** (per video):
- `index.html` — main composition (root timeline = scenes)
- `hyperframes.json`, `meta.json`, `package.json` — project + CLI config
- `assets/` — local woff2 fonts (your brand fonts), audio, images
- `scripts/` — the FAL + ffmpeg helpers for that video
- `renders/` — rendered MP4 output (e.g. `silent.mp4`)
- `snapshots/` — check/preview snapshots

**Commands:**
```bash
npm run dev      # long-running preview server — run in background, never foreground
npm run check    # lint + runtime + layout + motion + contrast (MUST pass before render)
npm run render   # render to silent MP4
npm run publish  # shareable link
```

`npm run check` MUST pass (0 errors) before rendering; a batch driver should skip
any project that fails. Timed elements need
`data-start`/`data-duration`/`data-track-index` + `class="clip"`; timelines are
paused and registered on `window.__timelines`; deterministic logic only (no
`Date.now()`/`Math.random()`/fetch).

---

## 4. Audio + avatar (FAL)

**Proven models (defaults — override only with reason):**

| Model | Use | Approx cost |
|-------|-----|-------------|
| `fal-ai/flux/schnell` | Image drafts (composition / text-free check) | ~$0.003/img |
| `fal-ai/flux/dev` | Image finals (avatars, blog/hero photos) | ~$0.025/img |
| `fal-ai/elevenlabs/tts/multilingual-v2` | Voiceover | ~$0.10 / 1000 chars |
| `CassetteAI/music-generator` | Music bed (30s, commercial-use, no copyright) | ~$0.05-0.30 |
| `fal-ai/bytedance/omnihuman` | Lip-sync / talking avatar (image + audio -> video) | ~$0.14/sec |

Voice notes: **avoid MiniMax `Lively_Girl` (childish).** Pick a `voice_id` that
fits the brand and market (see the marketing-context file). Always draft one
segment and check the voice before generating all.

**VO -> continuous track -> beatmap flow:** generate each script segment as its
own clip, time-stretch each (pitch-preserved `atempo`, valid range 0.5-2.0) to the
approved beat-map durations so scene timing stays valid, then concat with a small
lead + inter-segment gaps + a tail hold into one `vo.wav`. Emit a `beatmap.json`
(per-segment start/end + total) that scene timing keys off. Store segment scripts
in the build log so the read is rerunnable.

**Music bed + ducking.** Generate a copyright-safe instrumental (AI-generated =
owned, safe on Reels/Shorts). Duck it under the VO with ffmpeg `sidechaincompress`
(music sidechained to the VO, roughly -6 dB), with a short fade-in and ~1.35-1.4s
fade-out. Keep one reusable bed per brand mood so you don't regenerate every run.

**Lip-sync avatar bookend.** OmniHuman animates a still portrait (a fictional
persona — never a real person) from an audio slice of the same VO (upload
image+audio to FAL storage, submit to the queue, poll, download). It is the
**expensive step (~$0.14/s)** — generate ONE short test clip to confirm
mouth/likeness before the full bookends, and reuse the validated intro clip where
possible. The avatar clip is muted in-composition; the master mix supplies audio.
Do NOT use HeyGen/TopView (interactive login, unavailable in-agent); FAL
lipsync/latentsync/veed need a *video* input, so OmniHuman is right for a still
portrait.

SFX are synthesized locally with ffmpeg (free, royalty-free) — e.g. a whoosh on a
scene flip, a generic notification ping (never a real trademarked sound), placed
with `adelay`.

---

## 5. The stitch / mux (final MP4)

FFmpeg assembles the final. The **video stream is copied untouched** (no
re-encode, byte-identical); only audio is (re)encoded to AAC 192k @ 44.1k, with
`+faststart` and `-shortest`.

**Music-bed-only:** trim the bed to the video length, `volume≈0.72`, ~0.6s
fade-in / ~1.4s fade-out, `alimiter=limit=0.9` safety (no clipping), then mux over
the copied video.

**Full mix (VO + ducked music + SFX):** build `mix.wav` (VO main + sidechain copy,
music ducked under VO, SFX delayed into place, `amix` then `alimiter=limit=0.95`),
then mux that into the silent render.

**Avatar reel (bookend + cross-fade):** (A) overlay the lip-synced avatar inside
the branded frame PNG; (B) normalize the motion render and `xfade` the intro into
it; (C) build the audio — continuous VO (padded/trimmed to total) + a looped,
ducked, faded music bed; (D) mux (`-c:v copy -c:a aac`).

Keep these as small reusable shell scripts in the project's `scripts/` so a
rebuild is one command.

---

## 6. Batch / daily system (optional)

To mass-produce one video per calendar day, keep a **Day-1 template project** and
a generator that emits one HyperFrames project per day from it, keeping the exact
scene structure, motion timeline, IDs, fonts and shadows, and swapping only the
accent color (via CSS vars), the hook stamp, the on-screen beats, the caption
lines, and the CTA. A batch driver then runs `npm run check` (skip on fail) ->
`npm run render` -> mux the side-correct bed -> verify each output with ffprobe.
This is the concrete expression of "same video, only the skin changes."

---

## 7. Realism defaults (avatar / portrait / talking-head gens)

Standing rule: append **`slight handheld drift, realistic facial pores`** to every
avatar / portrait / talking-head prompt. Handheld drift kills the locked-tripod AI
stillness; pores kill the over-retouched plastic-skin look. Include unless a shot
deliberately wants a static, stylized, or non-photoreal look.

**Negative / avoid list (all avatar gens):** text, watermark, logo, caption,
letters, signature, deformed features, extra fingers, over-retouched plastic skin,
airbrushed glam, stock-photo look, corporate-headshot stiffness, hyper-idealized
AI gloss, resemblance to any real/public figure.

Prompts stay layered: subject, setting, shot, lighting, brand palette by hex,
mood, style, negatives. Anchor to the project's real market (authentic local
contexts and faces). Save full prompts in the build log so they rerun.

---

## 8. Gotchas & verification

- **FAL over curl.** Some environments (e.g. macOS Python 3.13) can't verify FAL's
  SSL cert chain — route FAL HTTP through `curl` (system cert store).
  `Authorization: Key $FAL_API_KEY`.
- **No audio in-session.** You cannot hear audio while building. ALWAYS recommend
  a human listen pass before publishing anything with VO or a music bed.
- **Never claim a render is done** unless the MP4 exists AND ffprobe confirms an
  audio stream. Minimum check:
  ```bash
  ffprobe -v error -select_streams a:0 -show_entries stream=codec_type,codec_name -of csv=p=0 out.mp4
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 out.mp4
  ```
- **Guardrails.** Fictional personas only — no real-person likeness; no copyrighted
  audio (generate it); reproduce only your own wordmark (generic glyphs for
  third-party marks); stat cards state real product facts, never fabricated
  metrics (honest-until-real).

---

## 9. Costs

Rough per-video reference (FAL bills per generation; the lip-sync dominates):
- **Full narrated + lip-synced short:** ~$1.20-1.30 (OmniHuman is most of it).
- **Still-avatar / motion + VO + music:** ~$0.30.
- **Motion-only, scored (music bed, no VO/lip-sync):** ~$0.10, or $0 reusing a bed.
- **Type-driven HTML renders** (OG cards, carousels, silent motion): $0 FAL.

Cost discipline: draft on the cheap model (flux/schnell), lock the prompt +
composition, then generate finals once. Test one lip-sync clip before bookends.
Log models + approximate cost of every run in the build log.
