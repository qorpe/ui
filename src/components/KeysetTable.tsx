import { densityCell, useDensity } from "./Density";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Banner } from "./Banner";

/** One keyset page — `nextCursor: null` means the end (the frozen paging contract). */
export interface KeysetPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface KeysetColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
}

export interface KeysetTableProps<T> {
  columns: KeysetColumn<T>[];
  /** Loads one page. The kit clamps `take` to the contract's [1, 500] before calling. */
  loadPage: (cursor: string | null, take: number) => Promise<KeysetPage<T>>;
  rowKey: (row: T) => string;
  take?: number;
  emptyMessage?: string;
  /** Rendered INSIDE the card as its header strip (v1.3 §9.1 as corrected): search,
      facets and utilities belong to the TABLE, not to the page above it. */
  toolbar?: ReactNode;
  /** Strings-as-props (RFC D5); `loaded` composes the honest footer count. */
  labels?: { error?: string; retry?: string; loadMore?: string; loading?: string; end?: string; loaded?: (count: number) => string };
}

/** AdminPaging.Clamp, mirrored — the UI never asks for what the API would refuse. */
export function clampTake(take: number): number {
  if (!Number.isFinite(take)) return 50;
  return Math.min(500, Math.max(1, Math.trunc(take)));
}

type LoadState = "loading" | "idle" | "error";

/**
 * The keyset table of ui-standard-v1 §4: cursor pager only — NO offsets, NO page
 * numbers, NO total count (the contract deliberately never counts large tables).
 * Pages append; the walk ends when the API answers `nextCursor: null`.
 */
export function KeysetTable<T>({ columns, loadPage, rowKey, take = 50, emptyMessage = "Nothing here yet.", toolbar, labels = {} }: KeysetTableProps<T>) {
  const text = { error: "The page could not be loaded.", retry: "retry", loadMore: "load more", loading: "loading…", end: "· end", loaded: (n: number) => `${n} loaded`, ...labels };
  // The journal's density feature (§9.3): one rhythm for every family table.
  const cell = densityCell(useDensity());
  const [rows, setRows] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [state, setState] = useState<LoadState>("loading");
  const generation = useRef(0);

  const fetchPage = useCallback(
    async (from: string | null, fresh: boolean) => {
      const mine = ++generation.current;
      setState("loading");
      try {
        const page = await loadPage(from, clampTake(take));
        if (mine !== generation.current) return;   // a newer load superseded this one
        setRows((existing) => (fresh ? page.items : [...existing, ...page.items]));
        setCursor(page.nextCursor);
        setEnded(page.nextCursor === null);
        setState("idle");
      } catch {
        if (mine !== generation.current) return;
        setState("error");
      }
    },
    [loadPage, take],
  );

  useEffect(() => {
    void fetchPage(null, true);
  }, [fetchPage]);

  return (
    <div data-testid="keyset-table">
      <div className="overflow-hidden rounded-2xl border border-border bg-background" style={{ boxShadow: "var(--shadow-surface)" }}>
      {toolbar && <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">{toolbar}</div>}
      <div className="scroll-area overflow-x-auto">
      <table className="w-full border-collapse text-sm" aria-busy={state === "loading"}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`${index}-${column.header}`} className={`border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${column.align === "right" ? "text-end" : "text-start"}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-border transition-colors hover:bg-muted/40">
              {columns.map((column, index) => (
                <td key={`${index}-${column.header}`} className={`${cell} align-middle ${column.align === "right" ? "text-end" : ""}`}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
          {state === "idle" && rows.length === 0 && ended && (
            // Only the END of an empty walk is "empty" — an empty intermediate page keeps
            // the load-more path alive without contradicting itself (review R3 on this PR).
            // Rendered as the reference's own empty row (colSpan, py-16), same as Table.
            <tr>
              <td colSpan={columns.length}>
                <p className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>

      {state === "error" && (
        <div className="my-3">
          <Banner tone="danger">
            {text.error}
            <button
              className="btn-quiet ms-3 px-2 py-0.5 text-xs"
              onClick={() => void fetchPage(rows.length === 0 ? null : cursor, rows.length === 0)}
            >
              {text.retry}
            </button>
          </Banner>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs text-faint">
        <span className="text-xs text-faint">
          {/* The honest footer: what is LOADED — never a total (the offset trap reborn). */}
          {text.loaded(rows.length)}{ended ? ` ${text.end}` : ""}
        </span>
        {!ended && state !== "error" && (
          <button
            className="btn-quiet"
            disabled={state === "loading"}
            onClick={() => void fetchPage(cursor, false)}
          >
            {state === "loading" ? text.loading : text.loadMore}
          </button>
        )}
      </div>
    </div>
  );
}
