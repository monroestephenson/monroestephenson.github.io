import Link from "next/link"
import { SectionHeader } from "@/components/section-header"

interface Project {
  name: string
  tagline: string
  description: string
  spec: { term: string; detail: string }[]
  notes: string[]
  links: { label: string; href: string }[]
  lead?: boolean
}

const projects: Project[] = [
  {
    name: "FlowSketch",
    tagline: "Bounded-memory network telemetry",
    description:
      "You ask a declarative question (who are the top talkers, which hosts are scanning the most destinations) and it compiles to streaming sketches with explicit error and memory contracts. You know what an answer will cost before you run it, and the engine refuses plans it cannot afford. Packet payloads are never part of the event model.",
    spec: [
      { term: "Language", detail: "Rust 1.85+" },
      { term: "Licence", detail: "Apache-2.0" },
      { term: "Status", detail: "Pre-1.0, controlled beta" },
    ],
    notes: [
      "Count-Min, CountSketch, HyperLogLog, SpaceSaving, Misra-Gries and KLL",
      "Sliding event-time windows with merge-correct parallel execution",
      "Linux TPACKET_V3, AF_PACKET fan-out and tc eBPF capture",
      "Prometheus and OTLP export; compatible sketch state merges across nodes",
    ],
    links: [{ label: "Source", href: "https://github.com/monroestephenson/flowsketch" }],
    lead: true,
  },
  {
    name: "opn",
    tagline: "A local network detective",
    description:
      "It covers the usual lsof workflows and then keeps going: what is this machine doing on the network right now, what changed, and what to do about it. Reads process, socket, interface and packet state straight from OS APIs, and answers in prose for people or structured output for agents.",
    spec: [
      { term: "Language", detail: "Rust" },
      { term: "Install", detail: "brew, or cargo install" },
    ],
    notes: [
      "diagnose, watch and history as one investigation loop",
      "--llm hands identical machine state to an agent",
      "Fuzzed /proc/net parser; privileged firewall tests in CI",
    ],
    links: [
      { label: "Source", href: "https://github.com/monroestephenson/opn" },
      { label: "Homebrew tap", href: "https://github.com/monroestephenson/homebrew-tap" },
    ],
  },
  {
    name: "The Long Inheritance",
    tagline: "A map of literary descent",
    description:
      "Four thousand years of books borrowing from each other, drawn as a graph you can walk. Gilgamesh is in there, and so is last decade's fiction, and the edges are editorial judgements rather than citations, which is the interesting and arguable part.",
    spec: [
      { term: "Works", detail: "302" },
      { term: "Edges", detail: "565" },
      { term: "Built with", detail: "TypeScript, Vite" },
    ],
    notes: [
      "Search, filter and trace a single lineage back to its root",
      "Every influence edge is asserted by hand, not inferred",
    ],
    links: [
      { label: "Open the map", href: "/literature/" },
      { label: "Source", href: "https://github.com/monroestephenson/monroestephenson.github.io" },
    ],
  },
]

function ProjectPanel({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col border border-rule p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-h3">{project.name}</h3>
        <p className="micro text-ink-muted">{project.tagline}</p>
      </div>

      {/* The lead panel is full width, so its prose and its notes sit side by
          side rather than leaving half the panel empty. */}
      <div
        className={
          project.lead ? "mt-5 grid gap-x-12 gap-y-6 lg:grid-cols-2" : "mt-5"
        }
      >
        <p className="max-w-measure text-ink-muted">{project.description}</p>

        <ul className={project.lead ? "space-y-2" : "mt-6 space-y-2"}>
          {project.notes.map((note) => (
            <li key={note} className="meta flex gap-3 text-ink-muted">
              <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-s2" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-2 pt-8">
        {project.spec.map((item) => (
          <div key={item.term}>
            <dt className="micro text-ink-muted">{item.term}</dt>
            <dd className="meta text-ink">{item.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 border-t border-rule pt-5 meta">
        {project.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="link text-ink-muted"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </article>
  )
}

export function ProjectsSection() {
  const [lead, ...rest] = projects

  return (
    <div>
      <SectionHeader label="Projects" count={`${projects.length} repositories`} title="Things I build when nobody asked.">
        <p>
          Two of these watch a network honestly under load, the problem the
          sandpile above was built for, and both work by declaring their
          budget first and living inside it. The third points the same instinct at
          novels.
        </p>
      </SectionHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <ProjectPanel project={lead} />
        </div>
        {rest.map((project) => (
          <ProjectPanel key={project.name} project={project} />
        ))}
      </div>

      <p className="mt-8 meta">
        <Link
          href="https://github.com/monroestephenson"
          target="_blank"
          rel="noopener noreferrer"
          className="link text-ink-muted"
        >
          The rest is on GitHub
        </Link>
      </p>
    </div>
  )
}
