import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
}

export function SectionHeader({ title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">{subtitle}</p>}
      <div className="mt-4 h-1 w-20 bg-amber-700 dark:bg-amber-600" />
    </div>
  )
}

