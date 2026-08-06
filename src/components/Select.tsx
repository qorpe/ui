import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  /** Shown to the operator; the value itself when omitted. */
  label?: string;
  /** Visible but unchoosable: the keyboard walk skips it, a pointer bounces off it. */
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** The accessible name — a select without one is a mystery menu. */
  "aria-label": string;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * The family select (v1.2 §8.7 as modernized in U9): the FAMILY's own listbox — the
 * platform popup retires. Hand-rolled combobox pattern rather than a library popover:
 * it must live INSIDE modal dialogs, and no portal machinery survives that in every
 * environment the suite runs in. Keyboard: arrows walk, Enter/Space choose, Escape
 * closes, Home/End jump; an outside click closes without choosing.
 */
export function Select({ value, onChange, options, id, className = "", placeholder, disabled, "aria-label": label }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((option) => option.value === value)));
  const [dropUp, setDropUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  // The walk must stay VISIBLE, not just audible: long lists scroll the highlight
  // into view (jsdom shims scrollIntoView, so tests observe the call, not motion).
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  // If the VALUE moves while the list is open (an external update), the highlight
  // follows it — reopening already re-derives, this covers the open case.
  useEffect(() => {
    if (!open) return;
    const index = options.findIndex((option) => option.value === value);
    if (index >= 0) setActive(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // An outside pointer closes without choosing — the operator changed their mind.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const chosen = options.find((option) => option.value === value);

  const openAt = (index: number) => {
    setActive(Math.max(0, index));
    // Flip upward when the viewport bottom would clip the list (max-h-64 ≈ 256px + margin)
    // and there is more room above — measured at open, the moment that decides.
    const rect = root.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setDropUp(below < 280 && rect.top > below);
    }
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  // The keyboard walk lands only on choosable options: step over disabled ones and
  // stay put when nothing choosable remains in that direction.
  const stepEnabled = (from: number, direction: 1 | -1) => {
    let index = from + direction;
    while (index >= 0 && index < options.length && options[index]?.disabled) index += direction;
    return index >= 0 && index < options.length ? index : from;
  };
  const firstEnabled = () => Math.max(0, options.findIndex((option) => !option.disabled));
  const lastEnabled = () => {
    for (let index = options.length - 1; index >= 0; index--) {
      if (!options[index]?.disabled) return index;
    }
    return options.length - 1;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openAt(options.findIndex((option) => option.value === value));
      return;
    }
    if (!open) return;
    event.preventDefault();
    if (event.key === "ArrowDown") setActive((current) => stepEnabled(current, 1));
    else if (event.key === "ArrowUp") setActive((current) => stepEnabled(current, -1));
    else if (event.key === "Home") setActive(firstEnabled());
    else if (event.key === "End") setActive(lastEnabled());
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else if (event.key === "Tab") setOpen(false);
  };

  return (
    <div ref={root} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        // The walk must be AUDIBLE, not just visible: focus stays on the button, so the
        // highlighted option is exposed through aria-activedescendant (review R3).
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background ps-3 pe-2.5 text-sm text-foreground outline-none transition-colors focus:border-border-strong disabled:opacity-50"
        onClick={() => (open ? setOpen(false) : openAt(options.findIndex((option) => option.value === value)))}
        onKeyDown={onKeyDown}
      >
        <span className={chosen ? "truncate" : "truncate text-muted-foreground"}>
          {chosen ? (chosen.label ?? chosen.value) : (placeholder ?? "choose…")}
        </span>
        <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className={`absolute start-0 z-50 max-h-64 w-full min-w-max overflow-y-auto rounded-xl border border-border bg-background p-1.5 shadow-2xl ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={`flex select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                option.disabled ? "cursor-default text-faint" : "cursor-pointer"
              } ${index === active ? "bg-muted" : ""}`}
              onPointerMove={() => {
                if (!option.disabled) setActive(index);
              }}
              // Chosen on pointerDOWN so the choice lands before any outside-click logic.
              onPointerDown={(event) => {
                event.preventDefault();
                choose(index);
              }}
            >
              <span className="flex-1 truncate">{option.label ?? option.value}</span>
              {option.value === value && <Check size={14} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
