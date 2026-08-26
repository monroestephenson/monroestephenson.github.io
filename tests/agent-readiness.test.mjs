import test from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = new URL("..", import.meta.url).pathname
const outputDirectory = process.env.AGENT_BUILD_DIR ?? "out"
const out = join(root, outputDirectory)

function read(path) {
  const relativePath = path.startsWith("out/")
    ? join(outputDirectory, path.slice("out/".length))
    : path
  const fullPath = join(root, relativePath)
  assert.ok(existsSync(fullPath), `${path} is missing; run the production build first`)
  return readFileSync(fullPath, "utf8")
}

function routeHtml(route) {
  if (route === "/") return read("out/index.html")

  const slug = route.replace(/^\/+|\/+$/g, "")
  const candidates = [join(out, `${slug}.html`), join(out, slug, "index.html")]
  const match = candidates.find(existsSync)
  assert.ok(match, `No exported HTML found for ${route}`)
  return readFileSync(match, "utf8")
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? []
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([^\s=]+)="([^"]*)"/g)].map(([, name, value]) => [name.toLowerCase(), value]),
  )
}

function hasTag(html, name, expected) {
  return tags(html, name).some((tag) => {
    const actual = attributes(tag)
    return Object.entries(expected).every(([key, value]) => actual[key] === value)
  })
}

function decodeHtml(text) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    lt: "<",
    nbsp: " ",
    quot: '"',
    rsquo: "’",
  }

  return text
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity)
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
}

function visibleText(html) {
  return decodeHtml(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim()
}

function jsonLdDocuments(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(([, json]) => JSON.parse(decodeHtml(json)))
}

test("homepage remains useful without JavaScript and has a real heading hierarchy", () => {
  const html = routeHtml("/")
  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map(([, level]) => Number(level))

  assert.equal(headings.filter((level) => level === 1).length, 1)
  assert.ok(headings.includes(2), "homepage must contain H2 section headings")
  assert.ok(headings.includes(3), "homepage must contain H3 item headings")
  assert.equal(headings[0], 1)

  for (let index = 1; index < headings.length; index += 1) {
    assert.ok(headings[index] - headings[index - 1] <= 1, "heading levels must not jump")
  }

  assert.ok(visibleText(html).length >= 500, "raw exported HTML must contain at least 500 visible characters")
})

test("homepage publishes complete identity metadata and truthful JSON-LD", () => {
  const html = routeHtml("/")
  const htmlTag = tags(html, "html")[0]

  assert.equal(attributes(htmlTag).lang, "en")
  const canonical = tags(html, "link")
    .map(attributes)
    .find((tag) => tag.rel === "canonical")
  assert.ok(["https://gramscian.com", "https://gramscian.com/"].includes(canonical?.href))
  assert.ok(hasTag(html, "link", {
    rel: "alternate",
    type: "text/markdown",
    href: "https://gramscian.com/index.md",
  }))
  assert.ok(hasTag(html, "link", { rel: "describedby", href: "/llms.txt" }))
  assert.ok(hasTag(html, "meta", { property: "og:type", content: "website" }))
  assert.ok(hasTag(html, "meta", {
    property: "og:image",
    content: "https://gramscian.com/monroe_profile.jpg",
  }))

  const documents = jsonLdDocuments(html)
  assert.equal(documents.length, 1)
  const graph = documents[0]["@graph"]
  assert.ok(Array.isArray(graph))

  const types = new Set(graph.map((node) => node["@type"]))
  assert.deepEqual(types, new Set(["WebSite", "Person", "ProfilePage"]))
  assert.ok(!types.has("Organization"), "a personal site must not fabricate an Organization")

  const person = graph.find((node) => node["@type"] === "Person")
  const website = graph.find((node) => node["@type"] === "WebSite")
  const profile = graph.find((node) => node["@type"] === "ProfilePage")

  assert.equal(website.name, "Monroe Stephenson")
  assert.equal(website.url, "https://gramscian.com/")
  assert.ok(website.description.length >= 50)
  assert.deepEqual(website.publisher, { "@id": "https://gramscian.com/#person" })

  assert.equal(person.name, "Monroe Stephenson")
  assert.equal(person.url, "https://gramscian.com/")
  assert.equal(person.image, "https://gramscian.com/monroe_profile.jpg")
  assert.ok(person.description.length >= 50)
  assert.equal(person.jobTitle, "Backend engineer")
  assert.match(person.email, /^mailto:/)
  assert.deepEqual(person.sameAs, [
    "https://github.com/monroestephenson",
    "https://linkedin.com/in/mostephenreed",
  ])

  assert.equal(profile.name, "Monroe Stephenson — personal site")
  assert.equal(profile.url, "https://gramscian.com/")
  assert.ok(profile.description.length >= 50)
  assert.deepEqual(profile.mainEntity, { "@id": "https://gramscian.com/#person" })
})

test("custom 404 gives humans and agents deterministic recovery links", () => {
  const html = read("out/404.html")

  assert.match(visibleText(html), /That page does not exist/)
  for (const href of ["/", "/about", "/contact", "/sitemap.xml", "/llms.txt"]) {
    assert.ok(hasTag(html, "a", { href }), `404 must link to ${href}`)
  }

  const markdown = read("out/404.md")
  assert.match(markdown, /^# 404 — Page not found/m)
  assert.match(markdown, /https:\/\/gramscian\.com\/sitemap\.xml/)
  assert.match(markdown, /https:\/\/gramscian\.com\/llms\.txt/)
})

test("origin robots policy allows requested agent tokens and advertises the sitemap", () => {
  const robots = read("out/robots.txt")
  const agents = [
    "ChatGPT-User",
    "OAI-SearchBot",
    "GPTBot",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "DeepSeekBot",
    "ora-agent",
  ]

  assert.match(robots, /User-agent: \*\s+Allow: \//)
  for (const agent of agents) {
    assert.match(robots, new RegExp(`User-agent: ${agent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`))
  }
  assert.doesNotMatch(robots, /Disallow:\s*\//)
  assert.match(robots, /Sitemap: https:\/\/gramscian\.com\/sitemap\.xml/)
})

test("llms.txt follows v2 ordering and contains concrete when-to-use guidance", () => {
  const llms = read("out/llms.txt")
  const lines = llms.split(/\r?\n/)
  const nonBlank = lines.filter((line) => line.trim())

  assert.equal(nonBlank[0], "# Monroe Stephenson")
  assert.match(nonBlank[1], /^> /)

  const firstSection = lines.findIndex((line) => line.startsWith("## "))
  assert.ok(firstSection > 0)
  assert.match(lines.slice(0, firstSection).join("\n"), /When to use this site:/)
  assert.match(lines.slice(0, firstSection).join("\n"), /does not authorize an agent to contact anyone/)

  const sections = llms.split(/^## /m).slice(1)
  for (const section of sections) {
    const sectionLines = section.split(/\r?\n/).slice(1).filter((line) => line.trim())
    assert.ok(sectionLines.length > 0)
    assert.ok(sectionLines.every((line) => /^- \[[^\]]+\]\(https?:\/\//.test(line)))
  }

  assert.ok(existsSync(join(out, "agent-instructions.md")))
  assert.ok(existsSync(join(out, "index.md")))
  assert.ok(read("out/index.md").length >= 500)

  const instructions = read("out/agent-instructions.md")
  assert.match(instructions, /^## When to use this site$/m)
  assert.match(instructions, /^## How to retrieve content$/m)
  assert.match(instructions, /send `Accept: text\/markdown`/)
  assert.match(instructions, /^## Attribution and boundaries$/m)
  assert.match(instructions, /not authorization to send email, open issues, submit forms, make commitments, or speak for Monroe/)
})

test("sitemap contains every canonical indexable page with last-modified dates", () => {
  const sitemap = read("out/sitemap.xml")
  const urls = [
    "https://gramscian.com/",
    "https://gramscian.com/about",
    "https://gramscian.com/contact",
    "https://gramscian.com/privacy",
    "https://gramscian.com/cranked",
    "https://gramscian.com/literature/",
  ]

  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => entry)
  assert.equal(entries.length, urls.length)
  for (const url of urls) {
    const entry = entries.find((candidate) => candidate.includes(`<loc>${url}</loc>`))
    assert.ok(entry, `sitemap entry missing for ${url}`)
    assert.match(entry, /<lastmod>2026-08-26<\/lastmod>/)
  }
})

test("literature export exists and declares its canonical URL", () => {
  const literature = read("out/literature/index.html")
  assert.ok(
    hasTag(literature, "link", {
      rel: "canonical",
      href: "https://gramscian.com/literature/",
    }),
  )
})

test("about, contact, and privacy are substantial canonical trust pages", () => {
  for (const route of ["/about", "/contact", "/privacy"]) {
    const html = routeHtml(route)
    assert.ok(visibleText(html).length >= 500, `${route} must have at least 500 visible characters`)
    assert.equal(tags(html, "h1").length, 1)
    assert.ok(tags(html, "h2").length >= 1)
    assert.ok(hasTag(html, "link", { rel: "canonical", href: `https://gramscian.com${route}` }))
    assert.ok(hasTag(html, "meta", {
      property: "og:image",
      content: "https://gramscian.com/monroe_profile.jpg",
    }))
  }
})

test("navigation exposes trust and agent resources and content routes self-canonicalize", () => {
  const home = routeHtml("/")
  for (const href of ["/about", "/contact", "/privacy", "/llms.txt"]) {
    assert.ok(hasTag(home, "a", { href }), `homepage footer must expose ${href}`)
  }

  const cranked = routeHtml("/cranked")
  assert.ok(hasTag(cranked, "link", { rel: "canonical", href: "https://gramscian.com/cranked" }))
  assert.ok(hasTag(cranked, "meta", {
    property: "og:image",
    content: "https://gramscian.com/monroe_profile.jpg",
  }))
  assert.match(read("components/footer.tsx"), /<a href="\/llms\.txt"/)
  assert.doesNotMatch(read("components/footer.tsx"), /<Link href="\/llms\.txt"/)
  assert.match(read("app/not-found.tsx"), /item\.staticFile \? \(/)
  assert.match(read("app/not-found.tsx"), /<a href=\{item\.href\}[^>]*>\{item\.label\}<\/a>/)
  assert.equal(read("out/CNAME"), "gramscian.com\n")
})
