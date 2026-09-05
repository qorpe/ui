---
"@qorpe/ui": minor
---

`TabPanel` accepts `className` (defaults to the previous `pt-4`): a scrolling panel inside a flex column can now carry `min-h-0 flex-1 overflow-y-auto` and its own padding without losing the ARIA pairing — the seam mockifyr's five tabbed screens need to move off their local Radix tabs.
