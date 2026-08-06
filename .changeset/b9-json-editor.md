---
"@qorpe/ui": patch
---

B9: `@qorpe/ui/json-editor` — the CodeMirror 6 JSON editor promotes from the
Mockifyr console as a SUBPATH export (RFC D6): the weight stays out of the
main bundle; import it only where a console actually edits JSON. The token-
ramp syntax theme serves light and dark with one theme; `JsonField` toolbar
labels are strings-as-props; controlled value reconciliation preserves the
cursor. Seven CodeMirror packages join, exact-pinned.
