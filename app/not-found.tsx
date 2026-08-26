import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
}

const recoveryLinks = [
  { href: "/", label: "Homepage", detail: "Biography, work, research, projects, and photographs", staticFile: false },
  { href: "/about", label: "About", detail: "First-party biographical context", staticFile: false },
  { href: "/contact", label: "Contact", detail: "Verified ways to reach Monroe", staticFile: false },
  { href: "/sitemap.xml", label: "Sitemap", detail: "Every indexable page", staticFile: true },
  { href: "/llms.txt", label: "Agent index", detail: "Machine-readable guidance and canonical links", staticFile: true },
]

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-[calc(100vh-7rem)] max-w-page px-5 pt-16 sm:px-8">
        <article className="py-20 md:py-28">
          <p className="micro text-critical">HTTP 404</p>
          <h1 className="mt-5 max-w-[12ch] text-hero">That page does not exist.</h1>
          <p className="mt-8 max-w-measure text-ink-muted">
            The requested path is not part of gramscian.com. Use one of these
            canonical routes to recover instead of guessing another URL.
          </p>

          <ul className="mt-12 max-w-2xl border-t border-rule md:mt-16">
            {recoveryLinks.map((item) => (
              <li key={item.href} className="border-b border-rule py-5">
                {item.staticFile ? (
                  <a href={item.href} className="link text-ink">{item.label}</a>
                ) : (
                  <Link href={item.href} className="link text-ink">{item.label}</Link>
                )}
                <p className="meta mt-2 text-ink-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </article>
      </main>

      <Footer />
    </>
  )
}
