# Agent-readiness operations

The application is a static Next.js export on GitHub Pages. Cloudflare proxies `gramscian.com`, so the repository controls content but not every response header or crawler decision.

## What the repository controls

The build publishes:

- a substantial server-rendered homepage with a real heading hierarchy;
- canonical and Open Graph metadata plus Person, WebSite, and ProfilePage JSON-LD;
- `/robots.txt`, `/llms.txt`, `/agent-instructions.md`, `/index.md`, and `/sitemap.xml`;
- substantial `/about`, `/contact`, and `/privacy` trust pages;
- a custom `404.html` and Markdown recovery document; and
- build-level tests in `tests/agent-readiness.test.mjs`.

Install both workspaces, then run the local artifact checks with:

```sh
npm ci --legacy-peer-deps
npm --prefix tools/literature ci
npm test
```

The test command builds and stages The Long Inheritance before exporting the
site, then verifies the generated HTML and machine-readable artifacts together.

Run the post-deployment transport audit with:

```sh
npm run verify:agent-endpoints
```

Set `AGENT_AUDIT_BASE_URL` to verify a preview or alternate host.
Set `AGENT_EXPECTED_CONTENT_SIGNAL` to the exact policy selected for the zone
when you also want the audit to enforce that response header.

## Required Cloudflare changes

These controls cannot be set through a GitHub Pages build:

1. In the Cloudflare zone for `gramscian.com`, disable or revise Managed `robots.txt` so it does not prepend `Disallow: /` for GPTBot, ClaudeBot, Google-Extended, or other agents that the origin file allows. Cloudflare's generated block is visible between `BEGIN Cloudflare Managed content` and `END Cloudflare Managed Content` in the live response. See [Managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).
2. In AI Crawl Control and any custom WAF or bot rules, make public `GET` and `HEAD` requests challenge-free for the intended crawlers while retaining ordinary rate limits. Do not grant a privileged WAF bypass from a spoofable User-Agent string alone. Use Cloudflare's verified-bot controls or operator-published IP ranges where a crawler-specific rule is necessary. See [AI Crawl Control](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/).
3. Decide the content-licensing policy before enabling conversion, then make the final edge responses send it explicitly. Cloudflare's managed converter defaults to `Content-Signal: ai-train=yes, search=yes, ai-input=yes` when the origin does not provide the header, and GitHub Pages cannot set it. A retrieval-friendly policy that declines training would instead be `ai-train=no, search=yes, ai-input=yes`; allowing training is a separate product decision.
4. Implement [acceptmarkdown.com](https://acceptmarkdown.com/guides) negotiation at the edge. The canonical URL must select HTML or Markdown according to the full `Accept` grammar and q-values, default to HTML for a missing header or `*/*`, return `406 Not Acceptable` when neither representation is acceptable, return `text/markdown; charset=utf-8` for Markdown, and send `Vary: Accept, Accept-Encoding` on HTML, Markdown, `404`, and `406` responses. Cloudflare [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) is available on Pro, Business, and Enterprise plans and can supply the HTML-to-Markdown conversion, but the managed toggle alone does not reliably add `Accept` to `Vary` on the HTML and 404 responses. Add a Worker or response-header transform for the complete contract; on a Free zone, use an equivalent Worker implementation or upgrade. Static GitHub Pages cannot perform negotiation itself.
5. Deploy `main`, purge the Cloudflare cache, and run `npm run verify:agent-endpoints`. The verifier exercises both HTML-first and Markdown-first request orderings for the homepage and 404s, but those are negotiation smoke checks unless a cache-hit header is observed. Confirm the normalized two-variant cache keys in Cloudflare analytics rather than keying on arbitrary raw `Accept` values.
6. Review AI Crawl Control and WAF events, then rerun the Ora audit. The verifier's User-Agent probes confirm only that spoofed public requests receive the real homepage; they cannot certify that a crawler arriving from its verified network identity is allowed.

`Google-Extended` is a robots control token, not an HTTP User-Agent. `ChatGPT-User`, Claude-User, and Perplexity-User are user-triggered retrieval agents; GPTBot and ClaudeBot have training-oriented roles. Choosing to allow retrieval does not logically require granting training access. The checked-in origin policy currently allows the audit-requested tokens, but the final Cloudflare policy should reflect the intended content-licensing decision rather than an audit score alone.

## Deliberately unresolved recommendations

This is a personal site, so its JSON-LD identifies a Person and WebSite. It does not invent an Organization, customer-service phone number, or street address. Add Organization structured data only if `gramscian` becomes a real organization and accurate public contact and postal details are available.

Canonical URLs, consistent names, structured data, and the sitemap strengthen brand discovery, but search position also depends on external indexing and references. After deployment, submit the sitemap in the relevant search consoles, ensure the canonical domain is present on GitHub and LinkedIn, and seek genuine third-party references rather than duplicative listings.
