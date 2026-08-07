---
"@qorpe/ui": patch
---

G4: the visual gate — every docs-map demo photographed in light, dark and RTL
(63 linux-rendered baselines; a drifted pixel fails CI, diffs upload as
artifacts). The animation standard lands with it (ui-standard §10.6): overlays
enter 200ms ease-out / exit 150ms ease-in — the Sheet now slides from its END
edge with RTL-aware keyframes — menus fade in only, reduced-motion kills all.
Baselines regenerate through the Playwright container
(`scripts/update-visual.sh`); mac pixels differ by design.
