# @qorpe/ui

## 0.4.0

### Minor Changes

- 4d05daf: Sheet: a `header` slot for headers that have to be interactive.

  The strip drew `title` as a plain string, so a panel needing a hover-to-copy subject line or a
  metadata row that changes shape per entity had to keep a local sheet. Two of mockifyr's did, which
  is what this feedback came from.

  `header` replaces what the strip SHOWS. `title` stays required and becomes the accessible name —
  an accessible name cannot be derived from arbitrary nodes, and Radix requires a Title regardless.
  Both it and `description` go `sr-only` rather than being dropped: hiding a thing and omitting it
  are different, and only one of them keeps the dialog announceable.

## 0.3.2

### Patch Changes

- b138578: AppShell: only the nav LIST scrolls; the rail footer is pinned.

  The whole rail was one scroller, so a console whose nav outgrew the viewport pushed its
  footer below the fold. The footer is where the tenant/service switcher lives — the control
  that scopes everything else on screen — and "scroll the sidebar to change tenant" is not a
  thing anybody should have to discover.

  Found adopting the shell in a console with twelve nav items across four groups: at a 720px
  viewport the rail measured 832px and the switcher started at y=707.

## 0.3.1

### Patch Changes

- 388dbe5: AppShell: the rail's visible search label honours `labels.search`.

  `labels.search` reached the collapsed button's tooltip and `aria-label`, while the
  expanded rail printed a hardcoded `Search`. So the one word an operator actually reads
  was the one word that could not be translated — in a kit whose stated rule is that
  strings are props with English defaults.

  A six-locale console would have shown "Search" in English on every one of them.

## 0.3.0

### Minor Changes

- 6e2eadd: `ShellNavItem.href`: a nav item with a URL renders as a real link.

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

## 0.2.0

### Minor Changes

- 16179c7: AppShell: a brand slot, neutral count badges, and a bleed surface — the three things a
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

## 0.1.2

### Patch Changes

- 1a1bd74: Sheet gains `maxWidth` (default 680): adopter feedback from mockifyr M2 —
  wide journal-detail panels (720) and narrow behavior panels (480) are real
  anatomies; the ceiling is a number, not a class-conflict fight.

## 0.1.1

### Patch Changes

- 140bb5d: The first adopter-feedback release: `FacetFilter` gains `compact` (the smaller
  trigger for dense toolbars) and trigger `className` passthrough; `SearchBox`
  gains wrapper `className` passthrough — both straight from mockifyr's M1
  migration (its method facet and toolbar layouts), fed back as issues instead
  of forks. Layout concerns stay the caller's; behavior is untouched.

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
