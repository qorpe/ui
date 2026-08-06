---
"@qorpe/ui": patch
---

B2: the family Select completes its four gaps — the keyboard walk scrolls the
highlighted option into view on long lists; the list flips upward when the
viewport bottom would clip it; options can be `disabled` (the walk skips them,
a pointer bounces off them, Home/End land on enabled ends); and an external
value change while the list is open moves the highlight with it. Each fix
carries a regression test.
