import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const badgeVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-1",
    "font-body font-medium",
    "rounded-full",
    "whitespace-nowrap",
    "transition-colors duration-[150ms]",
  ],
  {
    variants: {
      variant: {
        default: "bg-bg-subtle text-text-secondary border border-border",
        primary: "bg-primary-100 text-primary-700",
        secondary: "bg-secondary-100 text-secondary-700",
        accent: "bg-accent-100 text-accent-700",
        success: "bg-primary-50 text-primary-600 border border-primary-200",
        warning: "bg-accent-50 text-accent-600 border border-accent-200",
        error: "bg-red-50 text-error border border-red-200",
        info: "bg-secondary-50 text-secondary-600 border border-secondary-200",
      },
      size: {
        sm: "text-xs px-2 py-0.5 h-5",
        md: "text-sm px-2.5 py-1 h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon rendered before the badge label */
  icon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
);

Badge.displayName = "Badge";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Badge, badgeVariants };
