"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0–100. Drives the fill width and aria-valuenow. */
  value?: number;
  /** Optional human-readable label, e.g. "Domanda 4 di circa 12" */
  label?: string;
  /** Show the numeric percentage on the right of the label row */
  showPercentage?: boolean;
  /** Accessible label for screen readers (defaults to "Progresso") */
  srLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      label,
      showPercentage = false,
      srLabel = "Progresso",
      ...props
    },
    ref
  ) => {
    // Clamp value to [0, 100]
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <div className="w-full flex flex-col gap-2">
        {/* Label row */}
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-sm font-body text-text-secondary">
                {label}
              </span>
            )}
            {showPercentage && (
              <span
                className="text-sm font-body font-medium text-primary-600 tabular-nums"
                aria-hidden="true"
              >
                {Math.round(clamped)}%
              </span>
            )}
          </div>
        )}

        {/* Track */}
        <ProgressPrimitive.Root
          ref={ref}
          value={clamped}
          max={100}
          aria-label={srLabel}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn(
            "relative h-2.5 w-full overflow-hidden",
            "rounded-full",
            "bg-primary-100",
            className
          )}
          {...props}
        >
          {/* Fill */}
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full rounded-full",
              "bg-gradient-to-r from-primary-400 to-primary-500",
              // Smooth width transition — CSS only, no Motion needed for this
              "transition-[width] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              // Visual polish: subtle sheen on the fill
              "relative after:absolute after:inset-0 after:rounded-full",
              "after:bg-gradient-to-b after:from-white/20 after:to-transparent"
            )}
            style={{ width: `${clamped}%` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = "Progress";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Progress };
