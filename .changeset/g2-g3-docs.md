---
"@qorpe/ui": patch
---

G2+G3: the living docs go live. `gallery/docs-map.json` gives every one of the
barrel's 101 exports exactly ONE documented home across 21 demos;
`scripts/docs-gate.mjs` (CI gate G2) parses the barrel — never a hand-kept
list — and fails on a missing, stale or double-covered name. Every demo
renders in the test suite and passes axe (G3; color-contrast measured
elsewhere — jsdom cannot). The gallery page composes from the SAME data with
live dark/RTL toggles. First catch on first run: RunProgress's progressbar
had no accessible name — fixed via its labels.
