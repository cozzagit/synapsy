"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Provider — wraps the app (or a subtree) to enable tooltips
// ---------------------------------------------------------------------------

/**
 * Wrap your app (or the relevant subtree) with TooltipProvider.
 * A single provider at the root is enough.
 */
const TooltipProvider = TooltipPrimitive.Provider;

// ---------------------------------------------------------------------------
// Low-level primitives (re-exported for advanced composition)
// ---------------------------------------------------------------------------

const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

// ---------------------------------------------------------------------------
// TooltipContent
// ---------------------------------------------------------------------------

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Shape & color
        "rounded-lg bg-surface border border-border",
        // Spacing & typography
        "px-3 py-1.5 text-xs font-body text-text leading-snug",
        // Shadow
        "shadow-md",
        // Animation — Radix adds data attributes for open/close state
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        // Max width so long text wraps gracefully
        "max-w-[280px] text-center",
        // Prevent text selection on tooltip
        "select-none pointer-events-none",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";

// ---------------------------------------------------------------------------
// Convenience wrapper — single component API for common use case
// ---------------------------------------------------------------------------

export interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactNode;
  /** Tooltip text or rich content */
  content: React.ReactNode;
  /** Preferred side to render the tooltip */
  side?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  /** Offset in pixels from the trigger */
  sideOffset?: number;
  /** Delay in ms before showing the tooltip (default 300ms) */
  delayDuration?: number;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
}

const Tooltip = ({
  children,
  content,
  side = "top",
  sideOffset = 6,
  delayDuration = 300,
  disabled = false,
}: TooltipProps) => {
  if (disabled) return <>{children}</>;

  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

Tooltip.displayName = "Tooltip";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
};
