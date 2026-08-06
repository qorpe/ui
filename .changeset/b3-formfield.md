---
"@qorpe/ui": patch
---

B3: the form layer arrives — `Field` (label + description + error in one anatomy,
with `id`/`aria-labelledby`/`aria-describedby`/`aria-invalid` wired once) and the
`Input`/`Textarea` primitives on the `.control` skin. Works with a spread
`register()` on native controls and drives the family Select through a
react-hook-form Controller — both proven with the real library in tests.
