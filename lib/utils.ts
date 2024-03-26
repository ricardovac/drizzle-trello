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

export function generateRandomColors(length: number) {
  const colors = []
  for (let i = 0; i < length; i++) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
  }
  return colors
}

export function getTextColor(hex: string): "white" | "black" {
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}
