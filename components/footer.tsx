import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-5 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
        <p className="meta text-ink-muted">
          <span className="micro mr-3 text-ink">gramscian</span>
          Monroe Stephenson, Berlin
        </p>

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
    </footer>
  )
}
