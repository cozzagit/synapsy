import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

const avatarVariants = cva(
  // Base
  [
    "relative inline-flex shrink-0 items-center justify-center",
    "rounded-full overflow-hidden",
    "select-none",
  ],
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-12 text-sm",
        lg: "size-16 text-base",
        xl: "size-24 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Initials to display as fallback (max 2 chars) */
  initials?: string;
}

// ---------------------------------------------------------------------------
// Root Avatar — composes Radix primitives into a single ergonomic component
// ---------------------------------------------------------------------------

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, initials, ...props }, ref) => {
  // Derive display initials: cap at 2 chars, uppercase
  const displayInitials = initials
    ? initials.slice(0, 2).toUpperCase()
    : undefined;

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover"
        />
      )}

      {/* Fallback: warm primary→secondary gradient with initials */}
      <AvatarPrimitive.Fallback
        className={cn(
          "flex size-full items-center justify-center",
          // Warm gradient using design-system colors
          "bg-gradient-to-br from-primary-300 to-secondary-300",
          "text-text-inverse font-heading font-semibold",
          "tracking-wide"
        )}
        delayMs={src ? 400 : 0}
      >
        {displayInitials ?? (
          // Generic person silhouette when no initials provided
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-[55%] opacity-80 text-text-inverse"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = "Avatar";

// ---------------------------------------------------------------------------
// Low-level primitives re-exported for advanced composition
// ---------------------------------------------------------------------------

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center",
      "bg-gradient-to-br from-primary-300 to-secondary-300",
      "text-text-inverse font-heading font-semibold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
