import Image from "next/image"
import { SectionHeader } from "@/components/section-header"

interface Fact {
  term: string
  detail: string
  /** Optional trailing link, e.g. the body that funded the grant. */
  link?: { label: string; href: string }
}

const facts: Fact[] = [
  { term: "Now", detail: "Backend engineer, AI team at Superchat, Berlin" },
  { term: "Studying", detail: "M.S. Computer Science, Georgia Tech: security, networks, systems" },
  {
    term: "Before",
    detail: "Fulbright scholar, MPI for Mathematics in the Sciences",
    link: { label: "German-American Fulbright Commission", href: "https://www.fulbright.de/" },
  },
  { term: "Degree", detail: "B.A. Mathematics, Reed College" },
  { term: "Handle", detail: "gramscian, after Antonio Gramsci" },
]

const elsewhere = [
  { name: "GitHub", href: "https://github.com/monroestephenson" },
  { name: "LinkedIn", href: "https://linkedin.com/in/mostephenreed" },
  { name: "Email", href: "mailto:stephensonmonroe@gmail.com" },
]

export function IntroSection() {
  return (
    <div>
      <SectionHeader
        label="About"
        count="Berlin, since 2024"
        title="Mathematics first, then software."
      />

      <div className="grid gap-12 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-rule">
            <Image
              src="/monroe_profile.jpg"
              alt="Monroe Stephenson"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="max-w-measure space-y-5 text-ink-muted">
            <p>
              I read mathematics at Reed College: commutative algebra and
              combinatorics, mostly. I spent the years around it in other
              people&rsquo;s laboratories: particle physics at Texas Tech, network
              topology at Portland State, ideals and D-modules at Michigan,
              simplicial complexes at the Hebrew University of Jerusalem.
            </p>
            <p>
              A Fulbright took me to the Max Planck Institute for Mathematics in
              the Sciences in Leipzig, where I worked with Bernd Sturmfels on
              algebraic statistics: specifically, what the cumulant tensors of
              a mixed signal can tell you about the sources underneath it.
            </p>
            <p>
              I write software now, in Berlin, on Superchat&rsquo;s AI team, and the
              two halves turn out to be the same job. Both are about deciding
              which structure is really there and which one you are imposing.
            </p>
            <p>
              What has my attention outside work is intelligence under
              constraint: how much capability actually survives inside a fixed
              parameter count, a fixed memory budget, the RAM in a laptop I
              already own. Most of the reasons a thing supposedly won&rsquo;t fit
              turn out to be assumptions rather than limits, and I find the
              difference worth chasing.
            </p>
          </div>

          <dl className="mt-10 border-t border-rule">
            {facts.map((fact) => (
              <div
                key={fact.term}
                className="flex flex-col gap-1 border-b border-rule py-3 sm:flex-row sm:gap-8"
              >
                <dt className="micro w-32 shrink-0 pt-1 text-ink-muted">{fact.term}</dt>
                <dd className="meta text-ink">
                  {fact.detail}
                  {fact.link && (
                    <>
                      <br />
                      <a
                        href={fact.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link text-ink-muted"
                      >
                        {fact.link.label}
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 meta">
            {/* All of these leave the app, so plain anchors rather than next/link. */}
            {elsewhere.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="link text-ink-muted"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
