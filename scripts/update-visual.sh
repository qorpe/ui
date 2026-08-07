#!/usr/bin/env bash
# Regenerate the G4 visual baselines. Baselines are LINUX pixels; on a Mac this must
# run through the Playwright container (version must match @playwright/test).
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(node -p "require('@playwright/test/package.json').version")
docker run --rm \
  -v "$PWD":/work -v /work/node_modules \
  -w /work \
  "mcr.microsoft.com/playwright:v${VERSION}-noble" \
  bash -c "corepack enable && corepack prepare pnpm@10.28.2 --activate && pnpm install --frozen-lockfile && pnpm exec playwright test --update-snapshots"
echo "baselines updated — review the diff before committing."
