import Link from "next/link"
import { Sandpile } from "@/components/sandpile"

export function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-page px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36">
        {/*
          On a phone the pile has to arrive before the prose, or the thesis of
          the page sits below the fold. Explicit placement on lg puts it back
          alongside, spanning both text rows.
        */}
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
          <div className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="micro text-ink-muted">Berlin &middot; Backend engineer, AI</p>

            <h1 className="mt-6 text-hero">
              Monroe
              <br />
              Stephenson
            </h1>
          </div>

          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2">
            <div className="max-w-measure space-y-5 text-ink-muted">
              <p>
                I don&rsquo;t much trust the surface description of a thing. What
                I&rsquo;m after is the layer under it:{" "}
                <span className="text-ink">
                  the architecture beneath the product, the mechanism beneath the
                  policy, the real constraint beneath the claim that something
                  can&rsquo;t be done.
                </span>
              </p>
              <p>
                The pile beside this is that idea at its smallest. One rule: no
                site may hold four grains, and every bit of the structure
                follows from it. Bounded-memory sketches over a packet stream. How
                much capability survives inside the RAM you actually own. Four
                thousand years of novels quietly citing each other. Different
                clothes, same question.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 meta">
              <Link href="#work" className="link">
                Work
              </Link>
              <Link href="#research" className="link">
                Research
              </Link>
              <Link href="#projects" className="link">
                Projects
              </Link>
              <Link href="#contact" className="link">
                Contact
              </Link>
            </div>
          </div>

          <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">
            <Sandpile />

            <p className="mt-6 max-w-[48ch] meta text-ink-muted">
              An abelian sandpile, s&nbsp;=&nbsp;4, relaxing live on this page. Every
              grain lands on the same site; a site holding four passes one to each
              neighbour; grains reaching the edge leave the system. The three blues
              are grain counts 1, 2 and 3, and they are the only colours this
              site uses.{" "}
              <Link
                href="https://github.com/monroestephenson/Sandpiles"
                target="_blank"
                rel="noopener noreferrer"
                className="link text-ink"
              >
                My 2020 work on the model
              </Link>{" "}
              applied it to network topology under denial-of-service load.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
