# @qorpe/ui

## 0.1.0

### Minor Changes

- 5ce32b4: The first public release: the qorpe family UI kit — 26 components + tokens +
  helpers extracted from the Goldpath monorepo per the accepted extraction RFC,
  with the B1–B9 standardization series (family Select completed, FormField
  layer, four Mockifyr promotions, strings-as-props i18n contract, RTL logical
  properties, a11y closures, family-neutral names, JsonEditor subpath) and
  gates G1–G6 live in CI.

### Patch Changes

- 6a13b01: B1: the scrim and the palette shadow become tokens. `--overlay` (mapped to
  `bg-overlay`) replaces the `bg-black/40` literal in ModalOverlay and the
  CommandPalette backdrop; `--shadow-palette` replaces the palette's literal
  `shadow-[0_16px_50px_…]`. ui-standard §1's "a missing token is a design
  conversation" now holds for both — re-skins override the token, not the
  components. No visual change: the token values are the old literals.
- 6884bbf: B2: the family Select completes its four gaps — the keyboard walk scrolls the
  highlighted option into view on long lists; the list flips upward when the
  viewport bottom would clip it; options can be `disabled` (the walk skips them,
  a pointer bounces off them, Home/End land on enabled ends); and an external
  value change while the list is open moves the highlight with it. Each fix
  carries a regression test.
- bccd4b8: B3: the form layer arrives — `Field` (label + description + error in one anatomy,
  with `id`/`aria-labelledby`/`aria-describedby`/`aria-invalid` wired once) and the
  `Input`/`Textarea` primitives on the `.control` skin. Works with a spread
  `register()` on native controls and drives the family Select through a
  react-hook-form Controller — both proven with the real library in tests.
- db037f8: B4: four Mockifyr components promote into the kit, each with its first-ever
  tests — `Button` (cva variants; the danger variant now wears the FAMILY's
  outlined-danger tone instead of a filled red with hardcoded white),
  `Switch` (thumb rides `bg-background` — the white/#18181b pair retires),
  `EmptyState`, and `DropdownMenu` whose `DropdownMenuCheckItem` is a REAL
  Radix CheckboxItem now (`role=menuitemcheckbox` + `aria-checked`). Menu
  shadows ride the new `--shadow-menu` token. New exact-pinned deps:
  class-variance-authority, @radix-ui/react-slot, @radix-ui/react-switch.
- 639d449: B5+B6: the strings-as-props sweep (RFC D5) and the RTL closure. Every
  user-facing literal in the kit is now an overridable prop with an English
  default — AppShell/Dialog/Sheet/SearchBox/FacetFilter/CodeBlock/DensityToggle
  chrome copy, and `labels` objects on KeysetTable, VerbButton, RunProgress and
  AuditBlock (count-composed lines are label FUNCTIONS, so word order survives
  translation). Defaults are pinned by the existing tests; the overrides are
  proven by a dedicated suite. RTL: the last two physical margins (`ml-*`)
  become logical (`ms-*`) — the kit is logical-properties-clean.
- 89882bb: B7: the a11y closures — clickable Table rows are keyboard rows (tabIndex +
  Enter/Space), KeysetTable says `aria-busy` while a page loads, tab/panel id
  pairings take a `scope` prefix so two strips with the same item ids stay
  apart, column React keys stop colliding on duplicate headers, and the
  selected-marker rule (trailing Check, one weight rule) is written into
  ui-standard §10 with the rest of the kit-era rules.
- be2bf3a: B8: family-neutral names and ONE timestamp philosophy. `GoldpathAdminResult`
  becomes `AdminResult` (a deprecated alias carries the goldpath console through
  one migration window); the persisted keys and the palette event drop the
  goldpath prefix (`qorpe.ui.collapsed`, `qorpe.ui.density`,
  `qorpe:open-command` — persisted shell prefs reset once on upgrade); the
  service picker's id and stray label literal go neutral. AuditBlock's
  timestamps now ride `shortStamp`'s no-parse rule — the server's own value,
  never shifted through `Date`, with the raw value in the title.
- f86b85f: B9: `@qorpe/ui/json-editor` — the CodeMirror 6 JSON editor promotes from the
  Mockifyr console as a SUBPATH export (RFC D6): the weight stays out of the
  main bundle; import it only where a console actually edits JSON. The token-
  ramp syntax theme serves light and dark with one theme; `JsonField` toolbar
  labels are strings-as-props; controlled value reconciliation preserves the
  cursor. Seven CodeMirror packages join, exact-pinned.
- 3e617b8: G2+G3: the living docs go live. `gallery/docs-map.json` gives every one of the
  barrel's 101 exports exactly ONE documented home across 21 demos;
  `scripts/docs-gate.mjs` (CI gate G2) parses the barrel — never a hand-kept
  list — and fails on a missing, stale or double-covered name. Every demo
  renders in the test suite and passes axe (G3; color-contrast measured
  elsewhere — jsdom cannot). The gallery page composes from the SAME data with
  live dark/RTL toggles. First catch on first run: RunProgress's progressbar
  had no accessible name — fixed via its labels.
- 5ce32b4: G4: the visual gate — every docs-map demo photographed in light, dark and RTL
  (63 linux-rendered baselines; a drifted pixel fails CI, diffs upload as
  artifacts). The animation standard lands with it (ui-standard §10.6): overlays
  enter 200ms ease-out / exit 150ms ease-in — the Sheet now slides from its END
  edge with RTL-aware keyframes — menus fade in only, reduced-motion kills all.
  Baselines regenerate through the Playwright container
  (`scripts/update-visual.sh`); mac pixels differ by design.
