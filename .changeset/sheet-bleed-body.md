---
"@qorpe/ui": minor
---

Sheet: `body="bleed"` hands padding and scrolling to the child.

The panel wrapped its children in the one scrolling region. A detail panel whose tabs scroll their
own panes therefore sat inside a second scroller, and two scrollbars racing each other make both
feel broken — which is why mockifyr's journal and message panels stayed local even after the
`header` slot landed.

The same choice `AppShell` offers for its content surface, with the same name and the same reason.
The padded default is unchanged.
