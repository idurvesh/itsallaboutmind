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

CLAUDE_BIN="/Users/durveshnaik/.local/bin/claude"
HQ_DIR="/Users/durveshnaik/Documents/Claude/Projects/_HQ"
LOG_DIR="/tmp/content-loops"
STAMP="$(date +%Y-%m-%d)"
LOG="$LOG_DIR/$SITE_NAME-$STAMP.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR" || exit 1

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

  # Start from current main so we never build on a stale tree or fight a push.
  git checkout main >/dev/null 2>&1
  if ! git pull --rebase --autostash origin main; then
    echo "FATAL: git pull failed, refusing to run on a dirty or diverged tree"
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
  \`main\`, never push \`main\`, never deploy. Push only your \`$DRAFT_PREFIX\` branch.
  A human merges."
  else
    DEPLOY_LINE="${DEPLOY_CMD:-none, deployment happens automatically on git push to main}"
  fi

  PROMPT="$PROMPT

## RUNTIME CONFIG (authoritative, overrides any guess in the prompt above)

- Today is $STAMP.
- Publish mode: **$PUBLISH_MODE**.
- Build command: ${BUILD_CMD:-none, this is a static site with no build step}
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
- Do NOT commit to main. Do NOT push main. Do NOT deploy. Do NOT ping IndexNow.
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
  if [ "$branch" != "main" ]; then
    if git checkout main >/dev/null 2>&1; then
      echo "returned to main (left branch $branch in place for review)"
    else
      echo "WARNING: could not return to main from $branch, tree may be dirty"
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