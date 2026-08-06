import type { ReactNode } from "react";

/**
 * A centred empty-state block (promoted from the Mockifyr console, B4): a piece of
 * art in a soft tile, a title, an optional body line and optional actions — blank
 * areas read as intentional guidance rather than a void.
 */
export function EmptyState({
  art,
  title,
  body,
  action,
  className = "",
}: {
  art?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center ${className}`}>
      {art && <div className="mb-1">{art}</div>}
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {body && <p className="mx-auto max-w-[46ch] text-sm text-muted-foreground">{body}</p>}
      </div>
      {action && <div className="flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
