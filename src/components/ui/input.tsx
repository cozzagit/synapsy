"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label text — rendered above the input */
  label?: string;
  /** Helper text shown below the input in normal state */
  hint?: string;
  /** Error message — activates error styling and replaces hint */
  error?: string;
  /** Icon node rendered on the left side inside the input */
  iconLeft?: React.ReactNode;
  /** Icon node rendered on the right side inside the input */
  iconRight?: React.ReactNode;
  /** Associates the label with this input; auto-generated if omitted */
  id?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      iconLeft,
      iconRight,
      id: idProp,
      disabled,
      required,
      type = "text",
      ...props
    },
    ref
  ) => {
    // Generate a stable id when none is provided so label<->input linkage
    // always works without forcing consumers to supply one.
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);
    const describedBy =
      [hasError ? errorId : null, hint && !hasError ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium font-body leading-none",
              hasError ? "text-error" : "text-text",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="ml-1 text-accent-500"
              >
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {iconLeft && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-3.5 flex items-center pointer-events-none",
                "text-text-tertiary",
                hasError && "text-error"
              )}
            >
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(
              // Layout & spacing
              "w-full h-11 rounded-xl",
              "px-4 py-2.5",
              "text-sm font-body text-text",
              "bg-surface",
              // Border
              "border",
              hasError
                ? "border-error focus:border-error focus:ring-error/30"
                : "border-border focus:border-primary-500 focus:ring-primary-500/20",
              // Focus ring
              "outline-none",
              "transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
              "focus:ring-2",
              // Placeholder
              "placeholder:text-text-tertiary",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle",
              // Icon padding adjustments
              iconLeft && "pl-10",
              iconRight && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {iconRight && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute right-3.5 flex items-center pointer-events-none",
                "text-text-tertiary",
                hasError && "text-error"
              )}
            >
              {iconRight}
            </span>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-body text-error leading-snug"
          >
            {error}
          </p>
        )}

        {/* Hint text (only when no error) */}
        {hint && !hasError && (
          <p
            id={hintId}
            className="text-xs font-body text-text-tertiary leading-snug"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Input };
