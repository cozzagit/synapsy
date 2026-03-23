import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Optional label centred on the separator (e.g. "oppure") */
  label?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      label,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === "horizontal";

    // When a label is provided we render a compound layout instead of the
    // raw Radix element so we can place text in the middle.
    if (label && isHorizontal) {
      return (
        <div
          role={decorative ? "presentation" : "separator"}
          aria-orientation={decorative ? undefined : "horizontal"}
          className={cn("flex items-center gap-3 w-full", className)}
        >
          <div className="flex-1 h-px bg-border" aria-hidden="true" />
          <span className="shrink-0 text-xs font-body text-text-tertiary px-1">
            {label}
          </span>
          <div className="flex-1 h-px bg-border" aria-hidden="true" />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={cn(
          "shrink-0 bg-border",
          isHorizontal ? "h-px w-full" : "h-full w-px",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Separator };
