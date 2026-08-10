---
"@qorpe/ui": minor
---

Sheet: a `header` slot for headers that have to be interactive.

The strip drew `title` as a plain string, so a panel needing a hover-to-copy subject line or a
metadata row that changes shape per entity had to keep a local sheet. Two of mockifyr's did, which
is what this feedback came from.

`header` replaces what the strip SHOWS. `title` stays required and becomes the accessible name —
an accessible name cannot be derived from arbitrary nodes, and Radix requires a Title regardless.
Both it and `description` go `sr-only` rather than being dropped: hiding a thing and omitting it
are different, and only one of them keeps the dialog announceable.
