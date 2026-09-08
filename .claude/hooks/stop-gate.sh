#!/bin/sh
# Stop hook, MAINTAINER shape (goldpath delivery-cycle RFC D4), adapted for an npm package.
#
# D4's refinement is that the hook is adapted per audience, not copied: the .NET shape builds
# a solution and asks specdrift, neither of which exists here. What is fast and catches what
# actually goes wrong in this repository is the type check and the gates the README already
# names. A hook slower than a few seconds gets deleted, and a deleted gate is worse than an
# absent one because it is evidence the discipline does not work.
INPUT=$(cat)

case "$INPUT" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
command -v git >/dev/null 2>&1 || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

CHANGED=$(git status --porcelain -- '*.ts' '*.tsx' '*.css' '*.json' '*.md' 2>/dev/null)
[ -z "$CHANGED" ] && exit 0

command -v pnpm >/dev/null 2>&1 || exit 0
LOG=$(mktemp)

# 1. Types. The kit's whole value is the surface it exports; a red typecheck means the surface
#    is broken for every consumer, and it takes seconds to learn that.
if ! pnpm typecheck >"$LOG" 2>&1; then
  echo "stop-gate: typecheck is red — fix it before ending the turn." >&2
  tail -n 30 "$LOG" >&2
  rm -f "$LOG"
  exit 2
fi

# 2. G2 (export without docs) and G6 (exact pins) — cheap, and the two the README says are
#    easiest to breach by accident. G3/G4/G5 need a browser or a full run and belong in CI.
if [ -f scripts/docs-gate.mjs ] && ! node scripts/docs-gate.mjs >"$LOG" 2>&1; then
  echo "stop-gate: an export has no home in the gallery docs map (G2)." >&2
  tail -n 20 "$LOG" >&2
  rm -f "$LOG"
  exit 2
fi

if [ -x scripts/pin-gate.sh ] && ! sh scripts/pin-gate.sh >"$LOG" 2>&1; then
  echo "stop-gate: a dependency is not exact-pinned (G6)." >&2
  tail -n 20 "$LOG" >&2
  rm -f "$LOG"
  exit 2
fi

rm -f "$LOG"
exit 0
