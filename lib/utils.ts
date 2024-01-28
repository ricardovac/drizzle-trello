import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/[\s]/g, "-")
}

export function generateRandomHex() {
  return `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`
}
