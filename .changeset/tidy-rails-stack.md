---
"@qorpe/ui": patch
---

fix(app-shell): the collapsed head becomes part of the icon column

Three things in the collapsed rail were not rail items, and all three showed it.

The head laid the mark and the toggle side by side in the 50px the rail leaves between its own
padding, while both are `shrink-0` and together want about 70px; `justify-center` split the
overflow evenly, so the mark sat some 15px left of the column every nav row centres on. It now
stacks.

The mark rendered at whatever size the consumer set for the expanded head — beside 18px icons
that reads as chrome, not as something you can press, and it was in fact the one thing in the
rail that did nothing when clicked. Collapsed it now takes a rail item's slot, hover wash and
right-hand tooltip, and goes home when there is an `onHome` to go to. Its accessible name is the
title, which is the word it replaced.

The toggle kept a `p-1.5` box of its own, 30px against the column's 36. Collapsed it takes the
same slot and tooltip; expanded it stays the small affordance at the head's right edge, where a
full slot would only add padding.
