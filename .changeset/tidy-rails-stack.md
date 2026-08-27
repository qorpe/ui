---
"@qorpe/ui": patch
---

fix(app-shell): the head joins the icon column instead of sitting above it

Collapsed, the head is now ONE rail item: the mark at rest, the expand chevron under the pointer
or under keyboard focus, in the same 36x40 box as every item below. That slot's action never
changes — it expands, whichever glyph it is showing — so the swap is an affordance rather than a
mode, and a device with no hover still gets a mark it can tap.

This replaces what was there: the mark and the toggle side by side in the 50px the rail leaves
between its own padding, both `shrink-0` and together wanting about 70px, so `justify-center`
split the overflow and put the mark some 15px off the column every nav row centres on. Stacking
them fixed the centring but cost a row, which made the head the only part of the rail whose
height moved. One slot costs neither.

Going home is not on that slot. A rail already showing its nav has its own home item a row or two
down, and a second hidden action on a control whose glyph changes under the cursor is a guess.

Collapsed with no mark, the toggle keeps its own slot and tooltip — it just gets the column's
36x40 now instead of a 30px box of its own.

Expanded, the brand head faded on hover — the only hover in the rail that was not a background
change. It now takes the same rounded box, wash and `px-2.5` as the items under it, and the head
gives up its own `px-1` so the two washes start on the same line rather than four pixels apart.
