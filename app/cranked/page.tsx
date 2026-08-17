import type { Metadata } from "next"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Cranked Mathematics | Monroe Stephenson",
  description:
    "AI-assisted mathematical research in database systems and algebraic combinatorics, with reproducible computation and formal verification.",
  openGraph: {
    title: "Cranked Mathematics",
    description:
      "AI-assisted mathematical research in database systems and algebraic combinatorics, with reproducible computation and formal verification.",
    url: "https://gramscian.com/cranked",
    type: "website",
  },
}

type Thread = {
  area: string
  title: string
  description: string
  href?: string
  resources?: Array<{
    label: string
    href: string
  }>
}

const threads: Thread[] = [
  {
    area: "Database systems",
    title: "Optimal Prefix Ordering for Reverse-Hölder Cardinality Lower Bounds",
    description:
      "I am studying database constraints and cardinality estimation, including how prefix ordering affects provable lower bounds on join cardinalities.",
    href: "/papers/optimal-prefix-ordering-reverse-holder.pdf",
  },
  {
    area: "Algebraic combinatorics",
    title: "The Moment-Curve Anisotropy Conjecture for Simplicial 1-Cycles",
    description:
      "A proof of the d = 2 case of the moment-curve anisotropy conjecture. For every field and every nonzero simplicial 1-cycle with arbitrary nonzero coefficients on its support, the moment-curve middle form is anisotropic; consequently, the associated Gorensteinification is totally anisotropic. The graph-form theorem and its low-degree interfaces are machine-checked in Lean 4.",
    resources: [
      {
        label: "Revised manuscript (PDF)",
        href: "/papers/total-anisotropy-simplicial-1-cycles.pdf",
      },
      {
        label: "Manuscript source",
        href: "https://github.com/monroestephenson/p-anisotropy/tree/2e3b9f131c5ae2ed46e5e166619a2386afd93439/paper",
      },
      {
        label: "Lean formalization",
        href: "https://github.com/monroestephenson/d2-moment-curve-anisotropy-lean/tree/3bcbca9faab0a670131b46b19b521273c4f0ace2",
      },
    ],
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
              Cranked Mathematics is an experimental research program. I bring
              my mathematical background to problems that interest me and use
              AI agents intensively for literature search, computation, proof
              exploration, and formalization.
            </p>
            <p>
              The project has two aims: to make mathematical progress and to
              study the capabilities and limits of LLM-based agents in serious
              research. Agent output is treated as provisional until the
              resulting claims are supported by an independently readable
              proof, reproducible computation, or formal verification.
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
                  {thread.resources ? (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {thread.resources.map((resource) => (
                        <Link
                          key={resource.href}
                          href={resource.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="micro link decoration-transparent hover:decoration-current"
                        >
                          {resource.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
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
