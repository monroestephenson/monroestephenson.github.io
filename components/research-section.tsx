import Link from "next/link"
import { SectionHeader } from "@/components/section-header"

interface Person {
  name: string
  href?: string
}

interface Paper {
  title: string
  years: string
  institution: string
  institutionHref?: string
  /** Where it landed, if it landed. Journals are named; preprints say so. */
  venue?: string
  /** Every place the paper can be read, journal of record first. */
  identifiers?: { label: string; href: string }[]
  href?: string
  with: Person[]
  funding?: { name: string; href?: string }
  abstract: string
}

const papers: Paper[] = [
  {
    title: "Cumulant Tensors in Partitioned Independent Component Analysis",
    years: "2023 to 2024",
    institution: "Max Planck Institute for Mathematics in the Sciences",
    institutionHref: "https://www.mis.mpg.de",
    venue: "Preprint",
    identifiers: [{ label: "arXiv:2402.10089", href: "https://arxiv.org/abs/2402.10089" }],
    href: "https://arxiv.org/abs/2402.10089",
    with: [{ name: "Bernd Sturmfels", href: "https://math.berkeley.edu/~bernd/" }],
    funding: { name: "Fulbright Research Grant", href: "https://www.fulbright.de/" },
    abstract:
      "Classical independent component analysis assumes the sources underneath a mixed signal are fully independent. They usually are not. We relax the assumption to independence between groups, and ask what the higher cumulant tensors of the observed signal still determine about the partition, which is a question about the algebraic variety those tensors sweep out.",
  },
  {
    title: "p-anisotropy on the moment curve for homology manifolds and cycles",
    years: "2022",
    institution: "Hebrew University of Jerusalem",
    venue: "Combinatorica, 2025",
    identifiers: [
      { label: "Combinatorica, 2025", href: "https://doi.org/10.1007/s00493-025-00192-w" },
    ],
    href: "https://doi.org/10.1007/s00493-025-00192-w",
    with: [
      { name: "Karim Adiprasito", href: "https://webusers.imj-prg.fr/%7Ekarim.adiprasito/" },
    ],
    funding: {
      name: "ERC Consolidator Grant",
      href: "https://mathematics.huji.ac.il/news/congratulations-prof-karim-adiprasito-winning-erc-consolidator-grant",
    },
    abstract:
      "We prove that the Gorensteinification of the face ring of a cycle is totally p-anisotropic in characteristic p: given an appropriate Artinian reduction, it contains no nonzero p-isotropic elements. We also show the linear system of parameters can be chosen to correspond to a geometric realisation with points on the moment curve.",
  },
  {
    title: "Differential Power Operation on Ideals",
    years: "2021",
    institution: "University of Michigan",
    venue: "Involve, 2026",
    identifiers: [
      { label: "Involve 19 (2026) 2", href: "https://msp.org/involve/2026/19-2/involve-v19-n2-p02-s.pdf" },
      { label: "arXiv:2111.15653", href: "http://arxiv.org/abs/2111.15653" },
    ],
    href: "https://msp.org/involve/2026/19-2/involve-v19-n2-p02-s.pdf",
    with: [
      { name: "Jennifer Kenkel", href: "https://www.jennykenkel.coffee" },
      { name: "Janet Page", href: "http://www-personal.umich.edu/~jrpage/index.html" },
      {
        name: "Daniel Smolkin",
        href: "https://lsa.umich.edu/math/people/postdoc-faculty/smolkind.html",
      },
    ],
    funding: { name: "NSF DMS-1801697", href: "http://www.math.lsa.umich.edu/~kesmith/" },
    abstract:
      "We identify a class of monomial ideals in characteristic zero whose differential powers are eventually principal, take up the containment problem between ordinary and differential powers, and introduce a closure operation, differential closure, which agrees with the radical on simple D-modules.",
  },
  {
    title: "Analyzing Network Topology for DDoS Mitigation Using the Abelian Sandpile Model",
    years: "2020",
    institution: "Portland State University",
    href: "http://people.reed.edu/%7Emostephen/hw%20/ASM_SIAM.pdf",
    with: [
      { name: "Christof Teuscher", href: "https://www.teuscher-lab.com" },
      { name: "Art Duval", href: "http://www.math.utep.edu/Faculty/duval/home.html" },
    ],
    abstract:
      "A denial-of-service attack and a sandpile avalanche are the same shape of event: local overload propagating along a topology until it either dissipates or brings the structure down. We asked which network topologies stay subcritical under load. The model at the top of this page is the one from this work.",
  },
  {
    title: "LDMX, Light Dark Matter eXperiment",
    years: "2019",
    institution: "Texas Tech University",
    href: "http://people.reed.edu/%7Emostephen/hw%20/A_Brief_Summary_of_Research_Preformed_at_APD_in_the_Summer_of_2019.pdf",
    with: [{ name: "Andrew Whitbeck" }],
    abstract:
      "Experimental high-energy particle physics: detector design, data collection from oscilloscopes, scintillators and photomultiplier tubes, and the analysis afterwards. Also a summer of designing and modifying the circuits that made the readings possible.",
  },
]

export function ResearchSection() {
  return (
    <div>
      <SectionHeader label="Research" count={`${papers.length} papers`} title="What I did before the software.">
        <p>
          Commutative algebra, combinatorics, and eventually algebraic statistics.
          Read backwards, it is a fairly straight line from particle detectors to
          asking what a tensor knows about the sources under a signal.
        </p>
        <p className="mt-4">
          Current experimental work with AI agents lives at{" "}
          <Link href="/cranked" className="link">
            Cranked Mathematics
          </Link>
          .
        </p>
      </SectionHeader>

      <ol className="border-t border-rule">
        {papers.map((paper) => (
          <li
            key={paper.title}
            className="grid gap-x-10 gap-y-4 border-b border-rule py-8 md:grid-cols-12 md:py-10"
          >
            <div className="md:col-span-3">
              <p className="meta text-ink-muted">{paper.years}</p>
              {paper.venue && (
                <p
                  className={`micro mt-2 ${
                    paper.venue.startsWith("Preprint") ? "text-ink-muted" : "text-critical"
                  }`}
                >
                  {paper.venue}
                </p>
              )}
            </div>

            <div className="md:col-span-9">
              <h3 className="text-h3 max-w-[34ch]">
                {paper.href ? (
                  <Link
                    href={paper.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link decoration-transparent hover:decoration-current"
                  >
                    {paper.title}
                  </Link>
                ) : (
                  paper.title
                )}
              </h3>

              <p className="meta mt-3 text-ink-muted">
                {paper.institutionHref ? (
                  <Link
                    href={paper.institutionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {paper.institution}
                  </Link>
                ) : (
                  paper.institution
                )}
                {" · with "}
                {paper.with.map((person, index) => (
                  <span key={person.name}>
                    {person.href ? (
                      <Link
                        href={person.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {person.name}
                      </Link>
                    ) : (
                      person.name
                    )}
                    {index < paper.with.length - 1 ? ", " : ""}
                  </span>
                ))}
                {paper.funding && (
                  <>
                    {" · "}
                    {paper.funding.href ? (
                      <Link
                        href={paper.funding.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {paper.funding.name}
                      </Link>
                    ) : (
                      paper.funding.name
                    )}
                  </>
                )}
              </p>

              <p className="mt-4 max-w-measure text-ink-muted">{paper.abstract}</p>

              {paper.identifiers && (
                <p className="meta mt-4 flex flex-wrap gap-x-6 gap-y-1">
                  {paper.identifiers.map((identifier) => (
                    <Link
                      key={identifier.label}
                      href={identifier.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link text-ink-muted"
                    >
                      {identifier.label}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
