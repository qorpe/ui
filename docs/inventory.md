# The kit's inventory — generated, never typed

Generated from `src/index.ts` + `gallery/docs-map.json` by `scripts/inventory.mjs`.
Do not edit: CI regenerates it and fails on a diff (ui-standard §4).

| Export | Demo | What it is |
|---|---|---|
| `AdminResult` | Verb buttons | Confirm-before-verb is NOT optional; refusals render VERBATIM. |
| `AppShell` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `AppShellProps` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `AuditBlock` | Audit block | Old→new change rows; classified values are masked HERE as the second line of defence. |
| `AuditBlockProps` | Audit block | Old→new change rows; classified values are masked HERE as the second line of defence. |
| `AuditEntry` | Audit block | Old→new change rows; classified values are masked HERE as the second line of defence. |
| `Banner` | Banners | The kit's only message surface; tone from the ramp, live-region semantics chosen by the caller. |
| `BannerProps` | Banners | The kit's only message surface; tone from the ramp, live-region semantics chosen by the caller. |
| `Button` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `ButtonProps` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `COLLAPSE_KEY` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `Checkbox` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `CheckboxProps` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `CodeBlock` | Detail anatomy | The journal anatomy for Sheet interiors: dl/dt/dd rows, small-caps headings, honest copy button. |
| `CommandEntry` | Command palette | ⌘K opens it; the trigger and the palette stay decoupled through the window event. |
| `CommandGroup` | Command palette | ⌘K opens it; the trigger and the palette stay decoupled through the window event. |
| `CommandPalette` | Command palette | ⌘K opens it; the trigger and the palette stay decoupled through the window event. |
| `CommandPaletteProps` | Command palette | ⌘K opens it; the trigger and the palette stay decoupled through the window event. |
| `DENSITY_KEY` | Density | One rhythm for every family table, app-wide via context, persisted. |
| `DeadlineVerdict` | Run progress | Percentages from CHUNKS — the honest denominator; the deadline verdict is a pure function. |
| `Density` | Density | One rhythm for every family table, app-wide via context, persisted. |
| `DensityProvider` | Density | One rhythm for every family table, app-wide via context, persisted. |
| `DensityToggle` | Density | One rhythm for every family table, app-wide via context, persisted. |
| `DetailSection` | Detail anatomy | The journal anatomy for Sheet interiors: dl/dt/dd rows, small-caps headings, honest copy button. |
| `Dialog` | Sheet & Dialog | Sheet is the home of entity DETAIL; Dialog is the home of forms and decisions. |
| `DialogProps` | Sheet & Dialog | Sheet is the home of entity DETAIL; Dialog is the home of forms and decisions. |
| `DropdownMenu` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuCheckItem` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuContent` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuItem` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuLabel` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuSeparator` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuSub` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuSubContent` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuSubTrigger` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `DropdownMenuTrigger` | Dropdown menu | The menu that STAYS a menu (D3): actions and navigation; CheckItem is a real menuitemcheckbox. |
| `EmptyState` | Empty state | A void reads as intentional guidance: art, title, body, actions. |
| `FacetFilter` | Facet filter & search | Selection travels to the SERVER as a filter; SearchBox commits on Enter/blur, never per keystroke. |
| `FacetFilterProps` | Facet filter & search | Selection travels to the SERVER as a filter; SearchBox commits on Enter/blur, never per keystroke. |
| `FacetOption` | Facet filter & search | Selection travels to the SERVER as a filter; SearchBox commits on Enter/blur, never per keystroke. |
| `Field` | Form fields | Field wires label + description + error ONCE (aria-labelledby / describedby / invalid); works with a spread register() and under a Controller (D4). |
| `FieldProps` | Form fields | Field wires label + description + error ONCE (aria-labelledby / describedby / invalid); works with a spread register() and under a Controller (D4). |
| `GoldpathAdminResult` | Verb buttons | Confirm-before-verb is NOT optional; refusals render VERBATIM. |
| `IconAction` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `IconActionProps` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `Input` | Form fields | Field wires label + description + error ONCE (aria-labelledby / describedby / invalid); works with a spread register() and under a Controller (D4). |
| `KNOWN_STATES` | Status language | One tone mechanism: StateBadge + statusTone over the semantic ramp; domain vocabularies are app-side `extra` maps. |
| `KeyValueRow` | Detail anatomy | The journal anatomy for Sheet interiors: dl/dt/dd rows, small-caps headings, honest copy button. |
| `KeyValueRows` | Detail anatomy | The journal anatomy for Sheet interiors: dl/dt/dd rows, small-caps headings, honest copy button. |
| `KeysetColumn` | Keyset table | Append-only keyset paging — the honest footer counts what is LOADED, never a total. |
| `KeysetPage` | Keyset table | Append-only keyset paging — the honest footer counts what is LOADED, never a total. |
| `KeysetTable` | Keyset table | Append-only keyset paging — the honest footer counts what is LOADED, never a total. |
| `KeysetTableProps` | Keyset table | Append-only keyset paging — the honest footer counts what is LOADED, never a total. |
| `OPEN_COMMAND_EVENT` | Command palette | ⌘K opens it; the trigger and the palette stay decoupled through the window event. |
| `PageHeader` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `PageHeaderProps` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `RunProgress` | Run progress | Percentages from CHUNKS — the honest denominator; the deadline verdict is a pure function. |
| `RunProgressData` | Run progress | Percentages from CHUNKS — the honest denominator; the deadline verdict is a pure function. |
| `RunProgressProps` | Run progress | Percentages from CHUNKS — the honest denominator; the deadline verdict is a pure function. |
| `SYSTEM_ACTOR` | Audit block | Old→new change rows; classified values are masked HERE as the second line of defence. |
| `SearchBox` | Facet filter & search | Selection travels to the SERVER as a filter; SearchBox commits on Enter/blur, never per keystroke. |
| `SearchBoxProps` | Facet filter & search | Selection travels to the SERVER as a filter; SearchBox commits on Enter/blur, never per keystroke. |
| `Select` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `SelectOption` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `SelectProps` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `Sheet` | Sheet & Dialog | Sheet is the home of entity DETAIL; Dialog is the home of forms and decisions. |
| `SheetProps` | Sheet & Dialog | Sheet is the home of entity DETAIL; Dialog is the home of forms and decisions. |
| `ShellNavItem` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `ShellService` | App shell | Grouped nav with icons, inset accent bar, collapse keeps the icons and persists; the shell owns scrolling. |
| `StatCard` | Stat cards | The value arrives pre-formatted — the card computes nothing; the console invents no aggregate. |
| `StatCardProps` | Stat cards | The value arrives pre-formatted — the card computes nothing; the console invents no aggregate. |
| `StateBadge` | Status language | One tone mechanism: StateBadge + statusTone over the semantic ramp; domain vocabularies are app-side `extra` maps. |
| `StateBadgeProps` | Status language | One tone mechanism: StateBadge + statusTone over the semantic ramp; domain vocabularies are app-side `extra` maps. |
| `StatusTone` | Status language | One tone mechanism: StateBadge + statusTone over the semantic ramp; domain vocabularies are app-side `extra` maps. |
| `Switch` | Select, Checkbox, Switch | The family Select is a portal-free listbox (lives inside dialogs); disabled options are skipped; the list flips at the viewport edge (B2). |
| `TabPanel` | Tab strip | Pill tabs, roving tabindex, focus follows selection; `scope` prefixes the id pairing when two strips share item ids (B7). |
| `TabPanelProps` | Tab strip | Pill tabs, roving tabindex, focus follows selection; `scope` prefixes the id pairing when two strips share item ids (B7). |
| `TabStrip` | Tab strip | Pill tabs, roving tabindex, focus follows selection; `scope` prefixes the id pairing when two strips share item ids (B7). |
| `TabStripItem` | Tab strip | Pill tabs, roving tabindex, focus follows selection; `scope` prefixes the id pairing when two strips share item ids (B7). |
| `TabStripProps` | Tab strip | Pill tabs, roving tabindex, focus follows selection; `scope` prefixes the id pairing when two strips share item ids (B7). |
| `Table` | Table | The ONE table: rounded card, toolbar inside the card, keyboard-reachable clickable rows (B7). |
| `TableColumn` | Table | The ONE table: rounded card, toolbar inside the card, keyboard-reachable clickable rows (B7). |
| `TableProps` | Table | The ONE table: rounded card, toolbar inside the card, keyboard-reachable clickable rows (B7). |
| `Textarea` | Form fields | Field wires label + description + error ONCE (aria-labelledby / describedby / invalid); works with a spread register() and under a Controller (D4). |
| `Tooltip` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `TooltipProps` | Buttons & icon actions | Button is for everything that is NOT a mutating verb; danger wears the family's outlined tone. |
| `VerbButton` | Verb buttons | Confirm-before-verb is NOT optional; refusals render VERBATIM. |
| `VerbButtonProps` | Verb buttons | Confirm-before-verb is NOT optional; refusals render VERBATIM. |
| `VerbOutcome` | Verb buttons | Confirm-before-verb is NOT optional; refusals render VERBATIM. |

89 component exports.
