"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * Light is the print, dark is the negative, so the control says which one you
 * are about to get, rather than showing a sun or a moon.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="micro text-ink-muted transition-colors hover:text-ink"
      aria-label={
        mounted
          ? `Switch to ${isDark ? "print" : "negative"}`
          : "Switch colour scheme"
      }
    >
      <span
        aria-hidden="true"
        className={`inline-flex items-center gap-2 ${mounted ? "" : "opacity-0"}`}
      >
        {/* A swatch, so the control reads as one before the word is parsed. */}
        <span
          className={`h-[9px] w-[9px] border border-current ${isDark ? "bg-transparent" : "bg-current"}`}
        />
        {isDark ? "Print" : "Negative"}
      </span>
    </button>
  )
}
