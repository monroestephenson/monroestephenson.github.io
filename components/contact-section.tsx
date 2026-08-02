import Link from "next/link"
import { SectionHeader } from "@/components/section-header"

/*
  This page is a static export; there is no server to post a form to. The old
  contact form simulated a delay and then said "Message sent!" without sending
  anything. A real address that opens a real mail client is the honest control.
*/
const channels = [
  {
    term: "Email",
    label: "stephensonmonroe@gmail.com",
    href: "mailto:stephensonmonroe@gmail.com",
  },
  {
    term: "GitHub",
    label: "github.com/monroestephenson",
    href: "https://github.com/monroestephenson",
  },
  {
    term: "LinkedIn",
    label: "linkedin.com/in/mostephenreed",
    href: "https://linkedin.com/in/mostephenreed",
  },
]

export function ContactSection() {
  return (
    <div>
      <SectionHeader label="Contact" count="Berlin · CET" title="Say something.">
        <p>
          Email is the reliable channel. I&rsquo;m glad to talk about distributed
          systems, algebraic statistics, or which novel belongs on the graph and
          isn&rsquo;t.
        </p>
      </SectionHeader>

      <dl className="max-w-2xl border-t border-rule">
        {channels.map((channel) => (
          <div
            key={channel.term}
            className="flex flex-col gap-1 border-b border-rule py-4 sm:flex-row sm:items-baseline sm:gap-10"
          >
            <dt className="micro w-24 shrink-0 text-ink-muted">{channel.term}</dt>
            <dd className="meta">
              <Link
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="link text-ink"
              >
                {channel.label}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
