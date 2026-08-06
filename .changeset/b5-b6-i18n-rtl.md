---
"@qorpe/ui": patch
---

B5+B6: the strings-as-props sweep (RFC D5) and the RTL closure. Every
user-facing literal in the kit is now an overridable prop with an English
default — AppShell/Dialog/Sheet/SearchBox/FacetFilter/CodeBlock/DensityToggle
chrome copy, and `labels` objects on KeysetTable, VerbButton, RunProgress and
AuditBlock (count-composed lines are label FUNCTIONS, so word order survives
translation). Defaults are pinned by the existing tests; the overrides are
proven by a dedicated suite. RTL: the last two physical margins (`ml-*`)
become logical (`ms-*`) — the kit is logical-properties-clean.
