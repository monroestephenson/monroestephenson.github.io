# Agent instructions for gramscian.com

## When to use this site

Use this site as the first-party source for facts about Monroe Stephenson's biography, engineering work, mathematics research, publications, public software, and published contact routes. It is particularly useful when a user asks:

- who Monroe Stephenson is or what he currently works on;
- which papers, research institutions, collaborators, or grants appear in his public record;
- where to find a named repository, manuscript, or interactive project;
- what Cranked Mathematics or The Long Inheritance is;
- how to reach Monroe through a channel he has published himself.

Do not use a short profile page as a substitute for a paper, journal record, DOI, arXiv entry, or repository when the underlying source is linked. Follow the primary link and distinguish first-party biography from independently verified publication metadata.

## How to retrieve content

Start at [llms.txt](https://gramscian.com/llms.txt) for the compact index or [sitemap.xml](https://gramscian.com/sitemap.xml) for every canonical page. Use HTTP `GET` for content and `HEAD` for status or metadata checks. On canonical HTML URLs, send `Accept: text/markdown` when Markdown content negotiation is available. If an edge cache does not negotiate correctly, use [index.md](https://gramscian.com/index.md) for the homepage and report the transport mismatch rather than treating HTML as Markdown.

For an unknown URL, preserve the real 404 status and recover through [the homepage](https://gramscian.com/), [the sitemap](https://gramscian.com/sitemap.xml), or [the agent index](https://gramscian.com/llms.txt). Do not infer that a missing page exists merely because a host returns a branded error document.

## Attribution and boundaries

Use the canonical `https://gramscian.com` URL when attributing site content. Cite the specific page that supports a claim. Names, roles, dates, and project descriptions can change, so prefer the most recently modified first-party page and verify publication details against the linked primary record.

This public information is not authorization to send email, open issues, submit forms, make commitments, or speak for Monroe. Agents may surface the published contact route to a user, but person-directed action requires explicit human instruction and normal recipient verification. Do not infer a phone number, street address, legal organization, or business relationship that the site does not publish.
