import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage } from "@/components/content-page"
import { openGraphImage } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description:
    "A first-party biography of Monroe Stephenson: backend engineer, mathematician, Fulbright scholar, and Georgia Tech computer science student in Berlin.",
  alternates: {
    canonical: "https://gramscian.com/about",
  },
  openGraph: {
    title: "About Monroe Stephenson",
    description:
      "Backend engineering, mathematics, research, and the path connecting them.",
    url: "https://gramscian.com/about",
    type: "profile",
    images: [openGraphImage],
  },
}

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="Mathematics first, then software."
      intro="I am Monroe Stephenson, a backend engineer and mathematician living in Berlin. This page is the first-party account of the work, study, and research represented elsewhere on gramscian.com."
    >
      <section className="space-y-5" aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-h3 text-ink">The path here</h2>
        <p>
          I read mathematics at Reed College, concentrating on commutative
          algebra and combinatorics. Around that degree I worked in other
          people&rsquo;s laboratories: particle physics at Texas Tech, network
          topology at Portland State, ideals and D-modules at Michigan, and
          simplicial complexes at the Hebrew University of Jerusalem. A
          Fulbright research grant then took me to the Max Planck Institute for
          Mathematics in the Sciences in Leipzig, where I worked with Bernd
          Sturmfels on algebraic statistics and partitioned independent
          component analysis.
        </p>
        <p>
          I now build backend systems in Berlin. My current work is on
          Superchat&rsquo;s AI team in Kotlin and Quarkus; before that I built
          event-driven document pipelines in Go and production paths for
          machine-learning systems. I am also completing an M.S. in Computer
          Science at Georgia Tech, focused on security, networks, operating
          systems, and database internals. The mathematical and engineering
          halves are less separate than they sound: both require identifying
          which structure is really present and which structure the observer
          has imposed.
        </p>
      </section>

      <section className="space-y-5" aria-labelledby="site-heading">
        <h2 id="site-heading" className="text-h3 text-ink">About this site</h2>
        <p>
          The handle <em>gramscian</em> is a reference to Antonio Gramsci. This
          site collects my professional work, mathematical publications,
          software projects, and a smaller personal archive of photographs and
          reading. The recurring subject is capability under constraint: what a
          bounded-memory sketch can retain, what a tensor reveals about hidden
          sources, or how much serious work fits inside the hardware already on
          the desk.
        </p>
        <p>
          For source material, use the linked journal records, papers, and
          repositories rather than treating a short biography as a substitute.
          The most direct identity references are my{" "}
          <Link className="link text-ink" href="https://github.com/monroestephenson">
            GitHub profile
          </Link>{" "}
          and{" "}
          <Link className="link text-ink" href="https://linkedin.com/in/mostephenreed">
            LinkedIn profile
          </Link>.
        </p>
      </section>
    </ContentPage>
  )
}
