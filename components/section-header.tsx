import type { ReactNode } from "react"

interface SectionHeaderProps {
  /** Short name for the section, set in the metadata voice. */
  label: string
  /**
   * A true count of what follows: "5 positions", "28 plates". Sections here
   * are not a sequence, so they are not numbered; the quantity is the only
   * ordinal fact worth putting in the margin.
   */
  count: string
  title: string
  children?: ReactNode
}

export function SectionHeader({ label, count, title, children }: SectionHeaderProps) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
        <span className="micro text-ink">{label}</span>
        <span className="micro text-ink-muted">{count}</span>
      </div>

      <h2 className="mt-8 text-h2">{title}</h2>

      {children && (
        <div className="mt-5 max-w-measure text-ink-muted">{children}</div>
      )}
    </header>
  )
}
