---
"@qorpe/ui": patch
---

fix(app-shell): the collapsed head stacks so the mark keeps the icon column's centre

Collapsed, the rail leaves 50px between its own padding while the brand mark and the collapse
toggle are both `shrink-0` and together want about 70px. `justify-center` split that overflow
evenly, so the mark sat some 15px left of the column every nav row centres on. A wide mark hid
it; a square one made it plain. Stacking the two centres both on that column and neither has to
give up size to do it.
