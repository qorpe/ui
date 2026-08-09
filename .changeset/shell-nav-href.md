---
"@qorpe/ui": minor
---

`ShellNavItem.href`: a nav item with a URL renders as a real link.

The rail rendered every item as `<button onClick={onSelect}>`, which navigates but throws
away everything the browser gives an anchor for free — ⌘-click and middle-click into a
second tab, the context menu's "open in new tab" and "copy link address", and a link
announced as a link rather than a button that happens to move you.

An operator watching a journal in one tab while editing in another is the ordinary case
in a console, so that is not a small loss.

`onSelect` still fires on click, so a router preventDefaults and pushes state as before.
**Without `href` nothing changes**: the item is still a button, with the same classes —
shared between both elements deliberately, so that whether an item navigates is never a
visual question.
