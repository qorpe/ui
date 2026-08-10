import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { ModalClose, ModalDescription, ModalOverlay } from "./modal";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The entity's name — the sheet's accessible title. */
  title: string;
  /** One line saying what the reader is looking at (v1.1 §7.4). */
  description?: string;
  /**
   * Replaces the VISIBLE title/description block, for a header that has to be interactive —
   * a hover-to-copy subject line, a metadata row that changes shape per channel. It fills the
   * same bordered strip, so a sheet with a custom header still sits in the family layout.
   *
   * `title` stays required and becomes the accessible name: a name cannot be derived from
   * arbitrary nodes, and a dialog without one is a dialog a screen reader cannot announce.
   */
  header?: ReactNode;
  /** The close button's accessible name (strings-as-props, RFC D5). */
  closeLabel?: string;
  children: ReactNode;
  /** The panel's width ceiling in px (adopter feedback: wide journal details, narrow behavior panels). */
  maxWidth?: number;
  /**
   * How the panel treats its body. `padded` (the default) is the one scrolling region. `bleed`
   * hands padding and scrolling to the child — for a detail panel whose tabs scroll their own
   * panes, where an outer scroller would nest one inside another and make both feel broken.
   *
   * The same choice `AppShell` offers for its content surface, and for the same reason.
   */
  body?: "padded" | "bleed";
}

/**
 * The right-side detail panel of ui-standard v1.1 §7.4, reference-exact: a row click
 * opens the entity HERE instead of unfolding below the table. Radix Dialog carries the
 * a11y weight (focus trap, Escape, aria wiring) — the same primitive the reference uses.
 */
export function Sheet({ open, onOpenChange, title, description, header, children, closeLabel, maxWidth = 680, body = "padded" }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <ModalOverlay />
        <Dialog.Content
          data-testid="sheet"
          className="sheet-anim fixed inset-y-0 end-0 z-50 flex w-full flex-col border-s border-border bg-background shadow-2xl outline-none"
          style={{ maxWidth }}
        >
          <div className="border-b border-border px-6 py-4">
            {/* With a custom header the title and description still exist — silently, for the
                a11y tree. Radix requires a Title, and hiding it is not the same as omitting it. */}
            <Dialog.Title className={header ? "sr-only" : "text-base font-semibold"}>{title}</Dialog.Title>
            <ModalDescription
              description={description}
              title={title}
              className={header ? "sr-only" : "mt-0.5 text-sm text-muted-foreground"}
            />
            {header}
          </div>
          {body === "bleed" ? (
            <div data-testid="sheet-body" data-body="bleed" className="flex min-h-0 flex-1 flex-col">{children}</div>
          ) : (
            <div data-testid="sheet-body" data-body="padded" className="scroll-area min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
          )}
          <ModalClose className="absolute end-4 top-4" label={closeLabel} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
