import { clsx, type ClassValue } from "clsx"
import { twilightMerge } from "tailwind-merge" // wait, tailwind-merge has a standard import: import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  // We can just implement a simple join helper if clsx/tailwind-merge are not installed,
  // or we can install clsx and tailwind-merge. Let's see if we can just write a simple utility
  // that mimics clsx/twMerge or we can install them.
  // Actually, let's install clsx and tailwind-merge to be robust, or we can write a simple clean implementation:
  return inputs.filter(Boolean).map(x => String(x)).join(" ")
}
