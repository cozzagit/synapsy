import { clsx, type ClassValue } from "clsx";

/**
 * Utility for merging Tailwind CSS class names conditionally.
 * Uses clsx for conditional class joining. For conflict resolution
 * (e.g. two bg- classes), ensure only one variant is applied via CVA.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
