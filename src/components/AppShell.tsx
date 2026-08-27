import { useEffect, type ReactNode } from "react";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { Select } from "./Select";
import { Tooltip } from "./Tooltip";

export interface ShellNavItem {
  /** Stable id — also the capability key when the console lights panels by discovery. */
  id: string;
  label: string;
  /** The item's lucide icon — the rail shows it always, and it IS the item when collapsed. */
  icon?: ReactNode;
  /** Small-caps group heading this item sits under (ui-standard v1.1 §7.2). */
  group?: string;
  /**
   * Absent means the capability is present but has nothing to count. A string is printed
   * verbatim, so a console that abbreviates (`1234` → `1.2k`) keeps its own arithmetic —
   * only the app knows how big a number has to get before it stops being readable.
   */
  badge?: number | string;
  /**
   * What the count MEANS. Neutral by default: a number is a number, and red is a claim
   * that something is wrong (§2 — the ramp never carries meaning it was not given). A
   * console that badges failures asks for `"danger"` explicitly.
   */
  badgeTone?: "neutral" | "danger";
  /**
   * Makes the item a real link. Without it the item is a button, which navigates but cannot
   * be ⌘-clicked into a second tab — and watching two screens at once is what a console is
   * for. `onSelect` still fires on click, so a router can preventDefault and push state.
   */
  href?: string;
  onSelect: () => void;
}

export interface ShellService {
  name: string;
  onSelect: () => void;
}

export interface AppShellProps {
  /**
   * The rail head's mark, left of the product word — ui-standard §7.2 has always read
   * "brand head (mark + product word + subtitle)" and the shell rendered only the words.
   */
  brand?: ReactNode;
  /** Product/tenant word in the rail head — the console is one shell, many services. */
  title: string;
  /** The quiet second line under the title (the reference's "Mock Platform" slot). */
  subtitle?: string;
  nav: ShellNavItem[];
  activeId: string;
  children: ReactNode;
  /** Cross-service registry entries; a single-service console omits it entirely. */
  services?: ShellService[];
  activeService?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  /** Renders the rail's search trigger (v1.1 §7.14) — usually the kit's `openCommand`. */
  onSearch?: () => void;
  /** Makes the brand head a BUTTON that goes home — the reference's own affordance. */
  onHome?: () => void;
  /** Rendered at the rail foot — theme toggle, sign-out, whatever the app owns. */
  footer?: (collapsed: boolean) => ReactNode;
  /**
   * How the content surface treats its child. `padded` (the default) is §3's one
   * scrolling surface. `bleed` hands both padding and scrolling to the child — for a
   * workspace that fills the surface edge to edge and scrolls its own panes, where an
   * outer scroller would nest one inside another and make both feel broken.
   */
  surface?: "padded" | "bleed";
  /** Strings-as-props (RFC D5): the shell's own chrome copy. */
  labels?: { sections?: string; search?: string; collapse?: string; expand?: string; service?: string };
}

/**
 * Whether an item has a count worth printing. A numeric 0 is "nothing to count" and stays
 * silent; a string is the app's own formatting and is trusted, except when it is empty.
 */
function hasBadge(item: ShellNavItem): boolean {
  if (item.badge === undefined) return false;
  return typeof item.badge === "number" ? item.badge > 0 : item.badge.length > 0;
}

/** localStorage key for the persisted rail state — same contract as the reference. */
export const COLLAPSE_KEY = "qorpe.ui.collapsed";

/**
 * Reads the persisted rail state once, for callers that own `collapsed` — the state
 * survives a reload because an operator who narrowed the rail meant it (v1.1 §7.3).
 */
export function initialCollapsed(): boolean {
  try {
    return globalThis.localStorage?.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The app shell of ui-standard v1.1: grouped nav with icons, a 2px left-border accent on
 * the active item, and a collapse that keeps the ICONS — a collapsed rail is an icon
 * rail, not an empty gutter. The PAGE never scrolls; only the content surface does.
 */
export function AppShell({
  brand,
  title,
  subtitle,
  nav,
  activeId,
  children,
  services,
  activeService,
  collapsed = false,
  surface = "padded",
  labels = {},
  onToggleCollapsed,
  onSearch,
  onHome,
  footer,
}: AppShellProps) {
  // Persist on change, wherever the state itself lives.
  const text = { sections: "console sections", search: "Search", collapse: "collapse navigation", expand: "expand navigation", service: "service", ...labels };

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* private mode: the rail simply forgets */
    }
  }, [collapsed]);

  // Groups render in first-appearance order; ungrouped items form a nameless first group.
  const groups: { name: string | undefined; items: ShellNavItem[] }[] = [];
  for (const item of nav) {
    const bucket = groups.find((group) => group.name === item.group);
    if (bucket) bucket.items.push(item);
    else groups.push({ name: item.group, items: [item] });
  }

  // Collapsed, the head is ONE slot: the mark at rest, the expand chevron under the pointer, in
  // the same 36x40 box every item below occupies. Two controls stacked there would push the icon
  // column down by a row and make the head the only part of the rail whose height moves.
  //
  // That slot's ACTION never changes — it expands, whether it is showing the mark or the chevron —
  // so the swap is an affordance and not a mode. A touch device, which has no hover at all, still
  // gets a mark it can tap to open the rail, and the accessible name says "expand" throughout.
  //
  // Going home is not on it. A rail that is already showing its nav has a Dashboard item two rows
  // down; a hidden second action on a control whose glyph changes under the cursor is a guess.
  const collapsedHead = collapsed && brand && onToggleCollapsed ? (
    <Tooltip label={text.expand} side="right">
      <button
        aria-label={text.expand}
        aria-expanded={false}
        onClick={onToggleCollapsed}
        className="group relative flex h-9 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted"
      >
        <span className="flex items-center transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0 [&>img]:w-7 [&>svg]:w-7">{brand}</span>
        <ChevronsRight
          size={18}
          aria-hidden="true"
          className="absolute text-faint opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </button>
    </Tooltip>
  ) : null;

  // The standalone toggle survives for the cases the swap cannot cover: expanded, where it is a
  // small affordance at the head's right edge, and collapsed with no mark to swap.
  const toggleButton = onToggleCollapsed && !collapsedHead && (
    <button
      aria-label={collapsed ? text.expand : text.collapse}
      aria-expanded={!collapsed}
      className={`shrink-0 rounded-lg text-faint transition-colors hover:bg-muted hover:text-foreground ${collapsed ? "flex h-9 w-10 items-center justify-center" : "p-1.5"}`}
      onClick={onToggleCollapsed}
    >
      {collapsed ? <ChevronsRight size={18} aria-hidden="true" /> : <ChevronsLeft size={16} aria-hidden="true" />}
    </button>
  );
  const railToggle = collapsed && toggleButton
    ? <Tooltip label={text.expand} side="right">{toggleButton}</Tooltip>
    : toggleButton;

  return (
    <div data-testid="app-shell" className="flex h-dvh overflow-hidden bg-app">
      <aside
        data-collapsed={collapsed}
        className={`shrink-0 bg-app transition-[width] duration-300 ${collapsed ? "w-[74px]" : "w-[252px]"}`}
      >
        {/* The rail scrolls INDEPENDENTLY: a console composed of many capability panels
            must never clip its own nav inside the frame's overflow-hidden. */}
        <nav
          data-testid="shell-rail"
          aria-label={text.sections}
          className="flex h-full flex-col overflow-hidden px-3 pb-3"
        >
          {/* Collapsed the head holds exactly one 36x40 slot, so it neither overflows the 50px
              the rail leaves nor changes height between states. Everything the head has to say
              collapsed is said by that one square. */}
          <div className={`flex items-center py-4 ${collapsed ? "justify-center" : "justify-between"}`}>
            {/* Collapsed, the mark is all that is left of the head — a rail with no words
                and no mark is an anonymous gutter, which is why it survives the collapse
                while the words do not. */}
            {collapsed
              ? collapsedHead ?? (brand && (
                <span className="flex h-9 w-10 shrink-0 items-center justify-center [&>img]:w-7 [&>svg]:w-7">{brand}</span>
              ))
              : onHome ? (
                <button onClick={onHome} className="flex min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-1 text-start transition-colors hover:bg-muted">
                  {brand && <span className="flex shrink-0 items-center">{brand}</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{title}</span>
                    {subtitle && <span className="block truncate text-xs text-faint">{subtitle}</span>}
                  </span>
                </button>
              ) : (
                <span className="flex min-w-0 items-center gap-2.5 px-2.5 py-1">
                  {brand && <span className="flex shrink-0 items-center">{brand}</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{title}</span>
                    {subtitle && <span className="block truncate text-xs text-faint">{subtitle}</span>}
                  </span>
                </span>
              )}
            {railToggle}
          </div>

          {onSearch && (
            // Reference-exact trigger: the expanded rail shows the full search field with
            // its ⌘K hint; the collapsed rail keeps only the icon, centered like nav items.
            <div className="pb-2 pt-1">
              {collapsed ? (
                <Tooltip label={text.search} side="right">
                  <button
                    aria-label={text.search}
                    onClick={onSearch}
                    className="mx-auto flex h-9 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                  >
                    <Search size={18} aria-hidden="true" className="text-muted-foreground" />
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={onSearch}
                  className="flex h-9 w-full items-center gap-2.5 rounded-lg border border-border bg-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:border-border-strong"
                >
                  <Search className="size-4" aria-hidden="true" />
                  <span>{text.search}</span>
                  <kbd className="ms-auto rounded-md border border-border bg-background px-1.5 font-mono text-[11px]">⌘K</kbd>
                </button>
              )}
            </div>
          )}

          {services && services.length > 0 && !collapsed && (
            <div className="mb-2 px-1">
              <label className="control-label" htmlFor="qorpe-service">{text.service}</label>
              <Select
                id="qorpe-service"
                aria-label={text.service}
                className="mt-1 w-full"
                value={activeService ?? services[0].name}
                onChange={(name) => services.find((s) => s.name === name)?.onSelect()}
                options={services.map((service) => ({ value: service.name }))}
              />
            </div>
          )}

          {/* Only the LIST scrolls. The footer holds the tenant/service switcher — the control
              that scopes everything on screen — and a console whose nav has grown past the
              viewport must not push it below the fold. */}
          <div data-testid="shell-nav-scroll" className="scroll-area -mx-3 min-h-0 flex-1 overflow-y-auto px-3">
          {groups.map((group) => (
            <div key={group.name ?? "·"} className="mb-1">
              {group.name && !collapsed && (
                <div className="px-2.5 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-faint">{group.name}</div>
              )}
              {/* Collapsed rails keep the grouping legible as thin separators. */}
              {group.name && collapsed && <div className="mx-3 my-2 h-px bg-border" aria-hidden="true" />}
              {group.items.map((item) => {
                const active = item.id === activeId;
                // ONE class string for both elements: an anchor and a button that look even
                // slightly different would make "does this item navigate" a visual question.
                const itemClass = `relative mb-0.5 flex h-9 items-center rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? "mx-auto w-10 justify-center" : "w-full gap-2.5 px-2.5"
                } ${
                  active
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`;
                const inner = (
                  <>
                    {active && !collapsed && <span aria-hidden="true" className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-primary" />}
                    {item.icon && <span aria-hidden="true" className="flex shrink-0 items-center [&>svg]:h-[18px] [&>svg]:w-[18px]">{item.icon}</span>}
                    <span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
                    {!item.icon && collapsed && <span aria-hidden="true">{item.label.slice(0, 1).toUpperCase()}</span>}
                    {hasBadge(item) && !collapsed && (
                      <span
                        data-testid="nav-badge"
                        className={`ms-auto rounded-full px-1.5 text-xs ${
                          item.badgeTone === "danger" ? "bg-danger-bg text-danger" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                );
                // An href makes the item a REAL link, so the browser's own affordances work:
                // ⌘-click and middle-click open a second tab, the context menu offers "open in
                // new tab" and "copy link", and assistive tech announces a link rather than a
                // button that happens to navigate. `onSelect` still fires, so a router can
                // preventDefault and push state instead of reloading the document.
                //
                // Reference-exact (owner: "birebir Mockifyr"): items carry NO border; the
                // active one gets the fill plus a short accent bar INSET at its left edge — a
                // highlight, not a border.
                const button = item.href ? (
                  <a key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={itemClass} onClick={item.onSelect}>
                    {inner}
                  </a>
                ) : (
                  <button key={item.id} aria-current={active ? "page" : undefined} className={itemClass} onClick={item.onSelect}>
                    {inner}
                  </button>
                );
                // Collapsed, the NAME rides a real tooltip to the right of the rail —
                // the browser's title delay left the icons mute in practice (§8.5).
                return collapsed ? <Tooltip key={item.id} label={item.label} side="right">{button}</Tooltip> : button;
              })}
            </div>
          ))}

          </div>

          {footer && <div className="shrink-0 px-1 pb-1 pt-3">{footer(collapsed)}</div>}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 p-3 ps-0">
        {/* The ONE scrolling surface — the frame stays put while content moves (§3). */}
        <main
          data-testid="shell-surface"
          data-surface={surface}
          className={`h-full rounded-2xl border border-border bg-surface ${
            surface === "bleed" ? "overflow-hidden" : "scroll-area overflow-y-auto p-6"
          }`}
          style={{ boxShadow: "var(--shadow-surface)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  /** The one-line purpose sentence (v1.1 §7.8) — what this screen answers, in words. */
  purpose: string;
  /** Right-aligned actions: refresh, primary verbs. */
  actions?: ReactNode;
}

/** Every screen opens with this: what am I looking at, and why does it exist. */
export function PageHeader({ title, purpose, actions }: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{purpose}</p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
