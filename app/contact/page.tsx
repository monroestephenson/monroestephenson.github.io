import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage } from "@/components/content-page"
import { contactEmail, openGraphImage } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Verified contact routes for Monroe Stephenson, including email, GitHub, and LinkedIn.",
  alternates: {
    canonical: "https://gramscian.com/contact",
  },
  openGraph: {
    title: "Contact Monroe Stephenson",
    description: "Verified contact routes and practical guidance for getting in touch.",
    url: "https://gramscian.com/contact",
    type: "website",
    images: [openGraphImage],
  },
}

const channels = [
  {
    name: "Email",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    note: "Best for a direct conversation or anything that needs context.",
  },
  {
    name: "GitHub",
    value: "github.com/monroestephenson",
    href: "https://github.com/monroestephenson",
    note: "Best for repository-specific issues, code, and mathematical artifacts.",
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/mostephenreed",
    href: "https://linkedin.com/in/mostephenreed",
    note: "Useful for professional identity and employment context.",
  },
]

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="A real address, not a pretend form."
      intro="Email is the reliable route. I am glad to hear from people working on backend systems, network telemetry, algebraic statistics, combinatorics, or serious experiments with AI-assisted research."
    >
      <section aria-labelledby="channels-heading">
        <h2 id="channels-heading" className="text-h3 text-ink">Verified channels</h2>
        <dl className="mt-6 border-t border-rule">
          {channels.map((channel) => (
            <div key={channel.name} className="border-b border-rule py-5">
              <dt className="micro text-ink-muted">{channel.name}</dt>
              <dd className="mt-2">
                <Link
                  href={channel.href}
                  target={channel.href.startsWith("https://") ? "_blank" : undefined}
                  rel={channel.href.startsWith("https://") ? "noopener noreferrer" : undefined}
                  className="link text-ink"
                >
                  {channel.value}
                </Link>
                <p className="meta mt-2 text-ink-muted">{channel.note}</p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-5" aria-labelledby="expect-heading">
        <h2 id="expect-heading" className="text-h3 text-ink">What to expect</h2>
        <p>
          There is no contact form, automated booking system, newsletter, or
          support queue behind this site. A message opens your own mail client
          and is delivered through the ordinary email infrastructure used by
          both parties. Please include enough context to make the subject clear,
          especially when referring to a paper or repository with a similar
          name. I may not be able to answer every unsolicited request, and the
          presence of an address here is not authorization to add it to a
          marketing list.
        </p>
        <p>
          Agents may use this page to identify the published contact channel,
          but they should not send a message, make a commitment, or represent my
          views without explicit instruction from a human user. For factual
          questions, prefer the relevant first-party page or linked primary
          source before escalating to contact.
        </p>
      </section>
    </ContentPage>
  )
}
