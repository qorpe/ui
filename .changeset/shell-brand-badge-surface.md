---
"@qorpe/ui": minor
---

AppShell: a brand slot, neutral count badges, and a bleed surface — the three things a
second console could not express.

- **`brand`** puts a mark beside the product word, and it is what survives the collapse.
  §7.2 has always read "brand head (mark + product word + subtitle)" and the shell
  rendered only the words, so this is the component catching up with its own standard
  rather than a new idea.
- **`ShellNavItem.badgeTone`** defaults to **neutral**, where the badge was previously
  always `danger`. A count is not a state: red is a claim that something is wrong, and a
  console badging stub counts was showing an operator red numbers for a healthy system.
  A console that badges failures now asks for `badgeTone: "danger"` — which also makes
  its intent readable at the call site. **This changes the look of existing badges**;
  that is the point.
- **`ShellNavItem.badge`** accepts a string, so a console keeps its own abbreviation
  (`1234` → `1.2k`). Only the app knows when a number stops being readable.
- **`surface="bleed"`** hands padding and scrolling to the child, for a workspace that
  fills the surface and scrolls its own panes. The padded default is unchanged; without
  this such a workspace sits inside a second scroller and both feel broken.
