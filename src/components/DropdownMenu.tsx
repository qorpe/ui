import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";

/**
 * The menu that STAYS a menu (RFC D3, promoted from the Mockifyr console, B4):
 * actions and navigation open here; picking a VALUE is the family Select's job and
 * multi-filtering is FacetFilter's. `DropdownMenuCheckItem` is a REAL Radix
 * CheckboxItem now — `role=menuitemcheckbox` + `aria-checked`, not a bold row.
 */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const itemBase =
  "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors focus:bg-muted data-[highlighted]:bg-muted";

const contentBase = "z-50 rounded-xl border border-border bg-background p-1.5 text-foreground";
const contentShadow = { boxShadow: "var(--shadow-menu)" };

export function DropdownMenuContent({
  className = "",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={`${contentBase} min-w-56 ${className}`}
        style={contentShadow}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className = "", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return <DropdownMenuPrimitive.Item className={`${itemBase} ${className}`} {...props} />;
}

export function DropdownMenuLabel({ className = "", ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label className={`px-2.5 py-2 text-xs text-muted-foreground ${className}`} {...props} />;
}

export function DropdownMenuSeparator({
  className = "",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={`my-1.5 h-px bg-border ${className}`} {...props} />;
}

export function DropdownMenuSubTrigger({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger className={`${itemBase} ${className}`} {...props}>
      {children}
      <ChevronRight aria-hidden="true" className="ms-auto size-4 text-faint rtl:rotate-180" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className = "",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        sideOffset={sideOffset}
        className={`${contentBase} min-w-48 ${className}`}
        style={contentShadow}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/** A selectable menu row that SAYS it is selected: real checkbox semantics, trailing Check. */
export function DropdownMenuCheckItem({
  checked,
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={`${itemBase} ${checked ? "font-semibold" : ""} ${className}`}
      {...props}
    >
      {children}
      <DropdownMenuPrimitive.ItemIndicator className="ms-auto">
        <Check aria-hidden="true" className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}
