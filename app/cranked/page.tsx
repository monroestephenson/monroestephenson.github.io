import type { Metadata } from "next"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Cranked Mathematics | Monroe Stephenson",
  description:
    "Experimental work in database constraints, algebraic combinatorics, and AI-assisted mathematical research.",
  openGraph: {
    title: "Cranked Mathematics",
    description:
      "Experimental work in database constraints, algebraic combinatorics, and AI-assisted mathematical research.",
    url: "https://gramscian.com/cranked",
    type: "website",
  },
}

const threads = [
  {
    area: "Database systems",
    title: "Optimal Prefix Ordering for Reverse-Hölder Cardinality Lower Bounds",
    description:
      "I am studying database constraints and cardinality estimation, including how prefix ordering affects provable lower bounds on join cardinalities.",
    href: "/papers/optimal-prefix-ordering-reverse-holder.pdf",
  },
  {
    area: "Algebraic combinatorics",
    title:
      "Total Anisotropy on the Moment Curve for Simplicial 1-Cycles in Characteristic Not Two",
    description:
      "A first result toward Conjecture 6.1, proving the moment-curve statement for arbitrary simplicial 1-cycles over fields of characteristic different from two.",
    href: "/papers/total-anisotropy-simplicial-1-cycles.pdf",
  },
  {
    area: "Mathematics",
    title: "Combinatorics and commutative algebra",
    description:
      "More generally, I use the project to follow conjectures and structural questions in combinatorics and algebra wherever they lead.",
  },
]

export default function CrankedPage() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-rule focus:bg-paper focus:px-4 focus:py-2 focus:meta"
      >
        Skip to content
      </a>

      <header className="border-b border-rule">
        <nav className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="micro text-ink transition-colors hover:text-critical">
            gramscian
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/#research"
              className="micro text-ink-muted transition-colors hover:text-ink"
            >
              Back to research
            </Link>
            <span className="hidden h-3 w-px bg-rule sm:block" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="content" className="mx-auto min-h-[calc(100vh-13rem)] max-w-page px-5 sm:px-8">
        <article className="py-20 md:py-28">
          <p className="micro text-critical">Current mathematical work</p>
          <h1 className="mt-5 max-w-[12ch] text-hero">Cranked Mathematics</h1>

          <div className="mt-10 max-w-measure space-y-5 text-ink-muted md:mt-14">
            <p>
              Cranked Mathematics is my name for an experimental way of doing
              research: I bring my background in mathematics to conjectures and
              ideas that interest me, while using AI agents heavily for search,
              computation, attempted proofs, and formalization.
            </p>
            <p>
              The point is both mathematical and empirical. I want to make
              progress on the problems, but also to find the limits of
              LLM-based intelligence in serious mathematical work. The agents
              do not replace verification; part of the project is learning
              exactly where that distinction becomes decisive.
            </p>
          </div>

          <ol className="mt-16 border-t border-rule md:mt-20">
            {threads.map((thread) => (
              <li
                key={thread.title}
                className="grid gap-x-10 gap-y-3 border-b border-rule py-8 md:grid-cols-12 md:py-10"
              >
                <p className="meta text-ink-muted md:col-span-3">{thread.area}</p>
                <div className="md:col-span-9">
                  <h2 className="text-h3">
                    {thread.href ? (
                      <Link
                        href={thread.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link decoration-transparent hover:decoration-current"
                      >
                        {thread.title}
                      </Link>
                    ) : (
                      thread.title
                    )}
                  </h2>
                  <p className="mt-4 max-w-measure text-ink-muted">
                    {thread.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </main>

      <Footer />
    </>
  )
}
