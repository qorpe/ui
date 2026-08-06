---
"@qorpe/ui": patch
---

B1: the scrim and the palette shadow become tokens. `--overlay` (mapped to
`bg-overlay`) replaces the `bg-black/40` literal in ModalOverlay and the
CommandPalette backdrop; `--shadow-palette` replaces the palette's literal
`shadow-[0_16px_50px_…]`. ui-standard §1's "a missing token is a design
conversation" now holds for both — re-skins override the token, not the
components. No visual change: the token values are the old literals.
