"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const buttonVariants = cva(
  // Base styles shared across all variants
  [
    "inline-flex items-center justify-center gap-2",
    "font-body font-medium",
    "rounded-xl",
    "border border-transparent",
    "cursor-pointer select-none",
    "transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    // Focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
    // Disabled
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    // Loading state (applied via data attribute to keep hover suppressed)
    "data-[loading=true]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-500 text-text-inverse",
          "shadow-sm",
          "hover:bg-primary-600 hover:shadow-md hover:scale-[1.02]",
          "active:scale-[0.99] active:shadow-sm",
        ],
        secondary: [
          "bg-secondary-100 text-secondary-700",
          "hover:bg-secondary-200 hover:shadow-sm hover:scale-[1.02]",
          "active:scale-[0.99]",
        ],
        accent: [
          "bg-accent-500 text-text-inverse",
          "shadow-sm",
          "hover:bg-accent-600 hover:shadow-md hover:scale-[1.02]",
          "active:scale-[0.99] active:shadow-sm",
        ],
        outline: [
          "bg-transparent text-primary-600 border-primary-400",
          "hover:bg-primary-50 hover:border-primary-500 hover:scale-[1.02]",
          "active:scale-[0.99]",
        ],
        ghost: [
          "bg-transparent text-text-secondary",
          "hover:bg-surface-hover hover:text-text hover:scale-[1.02]",
          "active:scale-[0.99]",
        ],
        link: [
          "bg-transparent text-primary-600",
          "underline-offset-4 hover:underline hover:text-primary-700",
          "rounded-sm",
          // Override the scale for links — just color change
          "hover:scale-100",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (Radix Slot pattern for polymorphic usage) */
  asChild?: boolean;
  /** Show a loading spinner and suppress interaction */
  loading?: boolean;
  /** Icon placed before the button label */
  iconLeft?: React.ReactNode;
  /** Icon placed after the button label */
  iconRight?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        data-loading={loading}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2
              className="animate-spin shrink-0"
              size={size === "sm" ? 14 : size === "xl" ? 20 : 16}
              aria-hidden="true"
            />
            {children}
          </>
        ) : (
          <>
            {iconLeft && (
              <span className="shrink-0" aria-hidden="true">
                {iconLeft}
              </span>
            )}
            {children}
            {iconRight && (
              <span className="shrink-0" aria-hidden="true">
                {iconRight}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Button, buttonVariants };
