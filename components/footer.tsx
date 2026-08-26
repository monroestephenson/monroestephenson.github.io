import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <p className="meta text-ink-muted">
          <span className="micro mr-3 text-ink">gramscian</span>
          Monroe Stephenson, Berlin
        </p>

        <div className="space-y-3 text-left sm:text-right">
          <nav aria-label="Site information">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 meta text-ink-muted sm:justify-end">
              <li><Link href="/about" className="link">About</Link></li>
              <li><Link href="/contact" className="link">Contact</Link></li>
              <li><Link href="/privacy" className="link">Privacy</Link></li>
              <li><a href="/llms.txt" className="link">For agents</a></li>
            </ul>
          </nav>

          <p className="meta text-ink-muted">
            Set in Newsreader and IBM Plex.{" "}
            <Link
              href="https://github.com/monroestephenson/monroestephenson.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Source
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
