import { useRef } from "react";

export interface TabStripItem {
  id: string;
  label: string;
  /** Shown after the label — a count, a state word. Never the only carrier of meaning. */
  hint?: string;
}

export interface TabStripProps {
  items: TabStripItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Names the strip for screen readers — several strips can share a screen. */
  label: string;
  /** Prefixes the tab/panel id pairing — REQUIRED when two strips could share item ids (B7). */
  scope?: string;
}

/**
 * A tab strip with the ARIA pattern, not a row of buttons that looks like one: an
 * operator on a keyboard walks it with the arrow keys, Home and End, and only the active
 * tab is in the tab order (the pattern's "roving tabindex"). Without that, reaching the
 * last section of a six-tab screen costs six presses of Tab and the axe gate is right to
 * complain.
 */
export function TabStrip({ items, activeId, onSelect, label, scope }: TabStripProps) {
  // Two strips sharing item ids on one screen collided on the global tab-/panel- id
  // pattern (B7): a scope prefixes both sides of the pairing.
  const prefix = scope ? `${scope}-` : "";
  const strip = useRef<HTMLDivElement>(null);

  const move = (to: number) => {
    const target = items[(to + items.length) % items.length];
    onSelect(target.id);
    // Focus FOLLOWS selection in this pattern — an arrow key that changed the panel but
    // left focus behind would read as nothing having happened.
    const buttons = strip.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    buttons?.[(to + items.length) % items.length]?.focus();
  };

  return (
    <div ref={strip} role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            id={`tab-${prefix}${item.id}`}
            aria-selected={active}
            aria-controls={`panel-${prefix}${item.id}`}
            tabIndex={active ? 0 : -1}
            // Pills, class-verbatim from the reference (v1.1 §7.6) — the underline strip retires.
            className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelect(item.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") move(index + 1);
              else if (event.key === "ArrowLeft") move(index - 1);
              else if (event.key === "Home") move(0);
              else if (event.key === "End") move(items.length - 1);
              else return;
              event.preventDefault();
            }}
          >
            {item.label}
            {item.hint && <span className="ms-1.5 text-xs text-faint">{item.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  id: string;
  activeId: string;
  children: React.ReactNode;
  /** Must match the strip's `scope` — the two halves pair through the prefixed ids (B7). */
  scope?: string;
}

/** The panel half of the pattern — labelled by its tab, hidden when it is not the one. */
export function TabPanel({ id, activeId, children, scope }: TabPanelProps) {
  if (id !== activeId) {
    return null;
  }

  return (
    <div role="tabpanel" id={`panel-${scope ? `${scope}-` : ""}${id}`} aria-labelledby={`tab-${scope ? `${scope}-` : ""}${id}`} tabIndex={0} className="pt-4">
      {children}
    </div>
  );
}
