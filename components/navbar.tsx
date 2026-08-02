"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const sections = [
  { name: "Work", href: "#work", id: "work" },
  { name: "Research", href: "#research", id: "research" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Plates", href: "#plates", id: "plates" },
  { name: "Contact", href: "#contact", id: "contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Mark where you are. `critical` means current, here as everywhere else. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled ? "border-b border-rule bg-paper/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-page px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="micro text-ink transition-colors hover:text-critical">
            gramscian
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                aria-current={active === section.id ? "true" : undefined}
                className={cn(
                  "micro transition-colors hover:text-ink",
                  active === section.id ? "text-critical" : "text-ink-muted",
                )}
              >
                {section.name}
              </Link>
            ))}
            <span className="h-3 w-px bg-rule" aria-hidden="true" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-5 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="micro text-ink-muted transition-colors hover:text-ink"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-rule bg-paper px-5 py-5 md:hidden"
        >
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={section.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "micro",
                    active === section.id ? "text-critical" : "text-ink-muted",
                  )}
                >
                  {section.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
