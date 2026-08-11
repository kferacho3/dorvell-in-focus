import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, resolving Tailwind conflicts in favor of the last value.
 *
 * Without the merge step, a component's default (`px-6`) and a caller's
 * override (`px-0`) both land in the class attribute and the winner is decided
 * by stylesheet order rather than by intent.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
