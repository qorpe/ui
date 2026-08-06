---
"@qorpe/ui": patch
---

B8: family-neutral names and ONE timestamp philosophy. `GoldpathAdminResult`
becomes `AdminResult` (a deprecated alias carries the goldpath console through
one migration window); the persisted keys and the palette event drop the
goldpath prefix (`qorpe.ui.collapsed`, `qorpe.ui.density`,
`qorpe:open-command` — persisted shell prefs reset once on upgrade); the
service picker's id and stray label literal go neutral. AuditBlock's
timestamps now ride `shortStamp`'s no-parse rule — the server's own value,
never shifted through `Date`, with the raw value in the title.
