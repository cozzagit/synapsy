/**
 * Synapsy UI Component Library
 *
 * Central re-export barrel for all primitive UI components.
 * Import from "@/components/ui" rather than individual files to keep
 * import paths stable as the library grows.
 *
 * @example
 *   import { Button, Card, Input, Badge } from "@/components/ui";
 */

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
export { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Layout & Structure
// ---------------------------------------------------------------------------
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./card";

export { Separator } from "./separator";

// ---------------------------------------------------------------------------
// Inputs & Forms
// ---------------------------------------------------------------------------
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export { Input } from "./input";
export type { InputProps } from "./input";

// ---------------------------------------------------------------------------
// Data Display
// ---------------------------------------------------------------------------
export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

export { Avatar, AvatarImage, AvatarFallback, avatarVariants } from "./avatar";
export type { AvatarProps } from "./avatar";

export { Progress } from "./progress";
export type { ProgressProps } from "./progress";

// ---------------------------------------------------------------------------
// Overlays & Feedback
// ---------------------------------------------------------------------------
export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
export type { TooltipProps } from "./tooltip";
