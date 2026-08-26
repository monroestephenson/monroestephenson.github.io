import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage } from "@/components/content-page"
import { contactEmail, openGraphImage } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy information for gramscian.com, including hosting, local theme storage, email, and external links.",
  alternates: {
    canonical: "https://gramscian.com/privacy",
  },
  openGraph: {
    title: "Privacy at gramscian.com",
    description: "How this static personal site handles data and external services.",
    url: "https://gramscian.com/privacy",
    type: "website",
    images: [openGraphImage],
  },
}

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="A small site with a small data footprint."
      intro="gramscian.com is Monroe Stephenson’s personal website. It is designed to publish information, not to profile visitors. This notice explains the limited processing that can still occur when a static page is delivered across the internet."
    >
      <section className="space-y-5" aria-labelledby="collection-heading">
        <h2 id="collection-heading" className="text-h3 text-ink">What the site does not collect</h2>
        <p>
          There are no advertising trackers, audience analytics, user accounts,
          payment tools, comments, newsletter forms, or embedded social-media
          widgets on this site. I do not set a first-party tracking cookie or
          receive a visitor profile from a dedicated analytics product. The
          light or dark theme preference is stored locally in your browser so
          the interface can remember your choice; it is not sent to me as an
          analytics event.
        </p>
      </section>

      <section className="space-y-5" aria-labelledby="delivery-heading">
        <h2 id="delivery-heading" className="text-h3 text-ink">Delivery and technical logs</h2>
        <p>
          The site is built from a public GitHub repository, published through
          GitHub Pages, and delivered through Cloudflare. Like other web-hosting
          and security providers, those services may process an IP address,
          requested URL, user-agent string, timestamp, and related request data
          to deliver content, operate caches, prevent abuse, and maintain their
          systems. Their handling and retention of those technical records are
          governed by their own privacy terms. I do not operate a separate
          server-side database for gramscian.com.
        </p>
        <p>
          The Long Inheritance page requests the Archivo Narrow and Fraunces
          typefaces from Google Fonts when it loads. That request goes directly
          from your browser to Google and can expose ordinary request data such
          as your IP address, user-agent string, referring page, and requested
          font files. The rest of the site uses locally served fonts. Google’s
          handling of the font request is governed by its own privacy terms.
        </p>
      </section>

      <section className="space-y-5" aria-labelledby="communications-heading">
        <h2 id="communications-heading" className="text-h3 text-ink">Email and external links</h2>
        <p>
          If you email me, the message and address are processed by the email
          providers used by the sender and recipient and may be retained as long
          as needed to handle the conversation. Links to GitHub, LinkedIn,
          journals, universities, and other sites take you to services with
          their own privacy practices. Apart from the Google Fonts request
          disclosed above, following one of those links is a direct interaction
          with that service rather than a hidden embed.
        </p>
        <p>
          For a privacy question about this site, contact{" "}
          <Link className="link text-ink" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </Link>.
          This notice was last updated on 26 August 2026 and will be revised if
          the site begins using materially different services.
        </p>
      </section>
    </ContentPage>
  )
}
