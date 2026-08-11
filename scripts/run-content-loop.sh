#!/bin/bash
# ---------------------------------------------------------------------------
# PORTFOLIO CONTENT LOOP, shared wrapper template.
#
# Do not run this file directly. It is stamped into each site repo as
# scripts/run-content-loop.sh by _HQ/playbooks/install-content-loops.sh,
# with the __PLACEHOLDER__ values below replaced per site.
#
# Shape proven on gta6nerd 2026-07-27 and re-proven 2026-08-10 (TEST_MODE run
# wrote a fact-checked article, built clean, pushed a draft branch, left main
# untouched). See memory: unattended-publisher-pattern.
#
# Design rules that matter, learned the hard way:
#
#  1. LOGS GO TO /tmp. A launchd job whose StandardOutPath sits under
#     ~/Documents fails to spawn with exit 78 EX_CONFIG and produces silence,
#     not an error. That killed three engines for up to 17 days in July 2026.
#  2. RUN DAILY, PUBLISH WHAT THE CALENDAR OWES. launchd SKIPS a missed
#     StartCalendarInterval window rather than deferring it, so Mon/Wed/Fri
#     scheduling silently loses any day the lid was shut. Checking daily and
#     letting the calendar cap the rate gives the same 2-3 posts/week with
#     self-healing.
#  3. ALWAYS TAKE THE OLDEST UNCOVERED SLOT. A dark week gets worked off one
#     item at a time instead of being skipped forever.
#  4. TEST_MODE MUST EXERCISE THE REAL WRITE PATH. Forced to a draft branch,
#     no main push, no deploy, no IndexNow. Without it you can only test the
#     do-nothing path, which proves nothing.
#
# Manual run:  bash scripts/run-content-loop.sh
# Dry check:   DRY_RUN=1 bash scripts/run-content-loop.sh
# Write test:  TEST_MODE=1 bash scripts/run-content-loop.sh
# ---------------------------------------------------------------------------

set -uo pipefail

SITE_NAME="itsallaboutmind"
PROJECT_DIR="/Users/durveshnaik/Documents/Claude/Projects/itsallaboutmind"
PUBLISH_MODE="main"     # main | draft
BUILD_CMD="npm run build"           # empty string = no build step
DEPLOY_CMD=""         # empty string = deploy via git push, or none
DRAFT_PREFIX="content-draft/"
# Not every repo calls it "main". appyone-next's default branch is master.
MAIN_BRANCH="main"

CLAUDE_BIN="/Users/durveshnaik/.local/bin/claude"
HQ_DIR="/Users/durveshnaik/Documents/Claude/Projects/_HQ"
LOG_DIR="/tmp/content-loops"
STAMP="$(date +%Y-%m-%d)"
LOG="$LOG_DIR/$SITE_NAME-$STAMP.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR" || exit 1

# Real mutual exclusion, per site. Two runs in one working tree would fight over
# git checkout and push. This is enforced HERE rather than left to the agent to
# infer, because on 2026-08-11 the Appyone run inspected the process list, saw its
# OWN wrapper and its own `claude -p` child, concluded a sibling was running, and
# skipped the day for nothing. An agent cannot reliably tell its own process tree
# from a rival's, so it should never have to try.
# mkdir is atomic on POSIX, and macOS has no flock(1), so that is the lock.
LOCKDIR="$LOG_DIR/$SITE_NAME.lock"
if ! mkdir "$LOCKDIR" 2>/dev/null; then
  holder="$(cat "$LOCKDIR/pid" 2>/dev/null)"
  if [ -n "$holder" ] && kill -0 "$holder" 2>/dev/null; then
    echo "$(date): another $SITE_NAME run (pid $holder) holds the lock, exiting" \
      >> "$LOG_DIR/$SITE_NAME-$STAMP.log"
    exit 0
  fi
  # Holder is gone: a previous run was killed before it could clean up. Reclaim.
  echo "$(date): clearing stale lock from pid ${holder:-unknown}" \
    >> "$LOG_DIR/$SITE_NAME-$STAMP.log"
  rm -rf "$LOCKDIR"
  mkdir "$LOCKDIR" 2>/dev/null || exit 0
fi
echo "$$" > "$LOCKDIR/pid"
trap 'rm -rf "$LOCKDIR"' EXIT INT TERM

{
  echo "===== $SITE_NAME content loop $(date) ====="
  if [ "$PUBLISH_MODE" = "draft" ]; then
    echo "mode=draft build='${BUILD_CMD:-none}' deploy=FORBIDDEN (draft branch only)"
  else
    echo "mode=main build='${BUILD_CMD:-none}' deploy='${DEPLOY_CMD:-git-push}'"
  fi

  if [ ! -x "$CLAUDE_BIN" ]; then
    echo "FATAL: claude CLI not found at $CLAUDE_BIN"
    exit 1
  fi

  # Start from the current default branch so we never build on a stale tree or
  # fight a push.
  if ! git checkout "$MAIN_BRANCH" >/dev/null 2>&1; then
    echo "FATAL: cannot check out '$MAIN_BRANCH'. Is MAIN_BRANCH correct for this repo?"
    git branch -a | head -10
    exit 1
  fi
  if ! git pull --rebase --autostash origin "$MAIN_BRANCH"; then
    echo "FATAL: git pull failed, refusing to run on a dirty or diverged tree."
    echo "If the error mentions a 'bad object' or 'ref with broken name', the repo"
    echo "has a corrupted ref (iCloud duplicates a file inside .git as 'name 2')."
    echo "Delete the offending ref file, then re-run. Do not force-push past this."
    exit 1
  fi

  if [ "${DRY_RUN:-0}" = "1" ]; then
    echo "DRY_RUN: would run claude -p with scripts/content-loop-prompt.md"
    exit 0
  fi

  PROMPT="$(cat "$PROJECT_DIR/scripts/content-loop-prompt.md")"

  # Runtime facts the prompt needs but must not hardcode, so one prompt file
  # stays correct as the config changes.
  if [ "$PUBLISH_MODE" = "draft" ]; then
    DEPLOY_LINE="**FORBIDDEN.** This site is draft-branch-only. Never commit to
  \`$MAIN_BRANCH\`, never push \`$MAIN_BRANCH\`, never deploy. Push only your \`$DRAFT_PREFIX\` branch.
  A human merges."
  else
    DEPLOY_LINE="${DEPLOY_CMD:-none, deployment happens automatically on git push to $MAIN_BRANCH}"
  fi

  PROMPT="$PROMPT

## RUNTIME CONFIG (authoritative, overrides any guess in the prompt above)

- Today is $STAMP.
- Publish mode: **$PUBLISH_MODE**.
- Build command: ${BUILD_CMD:-none, this is a static site with no build step}
- Default branch for this repo: **$MAIN_BRANCH** (use this everywhere you would
  otherwise assume the default branch is named differently)
- Deploy: $DEPLOY_LINE
- Draft branch prefix: $DRAFT_PREFIX"

  if [ "${TEST_MODE:-0}" = "1" ]; then
    echo "TEST_MODE: forcing draft-branch output, no main push, no deploy, no IndexNow"
    PROMPT="$PROMPT

## TEST RUN OVERRIDE (these instructions win over everything above)

This is a supervised test of the write path, not a real publish.

- Ignore the rule that the slot must be dated today or earlier. Take the oldest
  uncovered slot regardless of date, so there is something to write.
- Commit to \`${DRAFT_PREFIX}test-${STAMP}-<slug>\` and push ONLY that branch.
- Do NOT commit to \`$MAIN_BRANCH\`. Do NOT push it. Do NOT deploy. Do NOT ping IndexNow.
- Still do everything else for real: verify every fact, write the full post,
  wire it into the blog index and llms.txt, and run the build if there is one
  and confirm it passes. Proving those steps work is the entire point.
- Say plainly in your summary that this was a TEST_MODE run, and name the branch."
  fi

  "$CLAUDE_BIN" -p "$PROMPT" \
    --permission-mode bypassPermissions \
    --add-dir "$HQ_DIR"

  status=$?
  echo "===== claude exit $status ====="

  # A successful draft-branch run legitimately ends on that branch, so return to
  # main ourselves rather than warning about it every single time. A warning that
  # fires on every run is one nobody reads.
  branch="$(git rev-parse --abbrev-ref HEAD)"
  echo "branch after run: $branch"
  if [ "$branch" != "$MAIN_BRANCH" ]; then
    if git checkout "$MAIN_BRANCH" >/dev/null 2>&1; then
      echo "returned to $MAIN_BRANCH (left branch $branch in place for review)"
    else
      echo "WARNING: could not return to $MAIN_BRANCH from $branch, tree may be dirty"
    fi
  fi

  # Only untracked/modified files matter here, and only if they are content.
  # Report them, but do not treat the loop's own scripts/ dir as an anomaly.
  dirty="$(git status --porcelain | grep -v ' scripts/$' | grep -v '^?? scripts/$')"
  if [ -n "$dirty" ]; then
    echo "WARNING: uncommitted changes left behind:"
    printf '%s\n' "$dirty"
  fi

  exit $status
} >> "$LOG" 2>&1