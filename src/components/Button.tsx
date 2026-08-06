import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted",
        subtle: "bg-muted text-foreground hover:bg-muted/70",
        // The FAMILY's destructive tone (ui-standard §5, same idiom as VerbButton):
        // outlined danger, never a filled red with hardcoded white text.
        danger: "border border-danger-border text-danger hover:bg-danger-bg",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-3 text-[13px]",
        icon: "size-9",
        iconSm: "size-8",
      },
    },
    defaultVariants: { variant: "outline", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders the child element with the button's skin (a styled link, for example). */
  asChild?: boolean;
}

/**
 * The plain generic button (promoted from the Mockifyr console, B4). Mutating admin
 * verbs stay VerbButtons — this is for everything else: form submits, navigation,
 * dialogs' non-verb actions.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={`${buttonVariants({ variant, size })} ${className ?? ""}`} {...props} />;
});
