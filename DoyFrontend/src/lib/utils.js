import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single className string
 * using clsx and tailwind-merge to handle conditional classes and
 * resolve Tailwind CSS conflicts.
 *
 * @param inputs - Class values to be merged (strings, objects, arrays, etc.)
 * @returns A merged className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}