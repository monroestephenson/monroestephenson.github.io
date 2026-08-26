import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface ContentPageProps {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}

export function ContentPage({ eyebrow, title, intro, children }: ContentPageProps) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-rule focus:bg-paper focus:px-4 focus:py-2 focus:meta"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="content" className="mx-auto min-h-[calc(100vh-7rem)] max-w-page px-5 pt-16 sm:px-8">
        <article className="py-20 md:py-28">
          <p className="micro text-critical">{eyebrow}</p>
          <h1 className="mt-5 max-w-[14ch] text-hero">{title}</h1>
          <p className="mt-8 max-w-measure text-ink-muted md:mt-10">{intro}</p>

          <div className="mt-12 max-w-measure space-y-8 border-t border-rule pt-10 text-ink-muted md:mt-16 md:pt-12">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
