---
"@qorpe/ui": patch
---

B4: four Mockifyr components promote into the kit, each with its first-ever
tests — `Button` (cva variants; the danger variant now wears the FAMILY's
outlined-danger tone instead of a filled red with hardcoded white),
`Switch` (thumb rides `bg-background` — the white/#18181b pair retires),
`EmptyState`, and `DropdownMenu` whose `DropdownMenuCheckItem` is a REAL
Radix CheckboxItem now (`role=menuitemcheckbox` + `aria-checked`). Menu
shadows ride the new `--shadow-menu` token. New exact-pinned deps:
class-variance-authority, @radix-ui/react-slot, @radix-ui/react-switch.
