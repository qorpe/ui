import * as SwitchPrimitive from "@radix-ui/react-switch";

/**
 * The family switch (promoted from the Mockifyr console, B4): a Radix switch on the
 * token ramp — the thumb rides `bg-background`, so both themes get it for free (the
 * old hardcoded white/#18181b pair retires).
 */
export function Switch({ className = "", ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={`peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${className}`}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" />
    </SwitchPrimitive.Root>
  );
}
