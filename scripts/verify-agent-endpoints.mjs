import http from "node:http"
import https from "node:https"

const baseUrl = new URL(process.env.AGENT_AUDIT_BASE_URL ?? "https://gramscian.com")
const failures = []

function check(condition, message) {
  if (!condition) failures.push(message)
}

function header(response, name) {
  const value = response.headers[name.toLowerCase()]
  return Array.isArray(value) ? value.join(", ") : value ?? ""
}

function headerIncludesToken(response, name, token) {
  return header(response, name)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .includes(token.toLowerCase())
}

function mediaType(response) {
  return header(response, "content-type").split(";", 1)[0].trim().toLowerCase()
}

function hasUtf8Charset(response) {
  return /(?:^|;)\s*charset\s*=\s*"?utf-8"?(?:;|$)/i.test(header(response, "content-type"))
}

function checkNegotiatedHeaders(response, label) {
  check(headerIncludesToken(response, "vary", "accept"), `${label}: Vary is missing Accept`)
  check(
    headerIncludesToken(response, "vary", "accept-encoding"),
    `${label}: Vary is missing Accept-Encoding`,
  )
}

function checkHtml({ response, body }, label, status = 200, marker = /Monroe Stephenson/) {
  check(response.status === status, `${label}: expected ${status}, received ${response.status}`)
  check(mediaType(response) === "text/html", `${label}: expected text/html Content-Type`)
  check(hasUtf8Charset(response), `${label}: HTML Content-Type is missing charset=utf-8`)
  checkNegotiatedHeaders(response, label)
  check(/<!doctype html>/i.test(body), `${label}: HTML document marker missing`)
  check(marker.test(body), `${label}: expected HTML content missing`)
}

function checkMarkdown({ response, body }, label, status = 200, marker = /^#\s+Monroe Stephenson/m) {
  check(response.status === status, `${label}: expected ${status}, received ${response.status}`)
  check(mediaType(response) === "text/markdown", `${label}: expected text/markdown Content-Type`)
  check(hasUtf8Charset(response), `${label}: Markdown Content-Type is missing charset=utf-8`)
  checkNegotiatedHeaders(response, label)
  check(!/<!doctype html>/i.test(body), `${label}: HTML body returned for Markdown`)
  check(marker.test(body), `${label}: expected Markdown content missing`)
}

function request(path, { method = "GET", headers = {} } = {}) {
  const url = new URL(path, baseUrl)
  const transport = url.protocol === "http:" ? http : https

  return new Promise((resolve, reject) => {
    const outgoing = transport.request(url, { method, headers }, (incoming) => {
      const chunks = []
      incoming.on("data", (chunk) => chunks.push(chunk))
      incoming.on("end", () => {
        resolve({
          response: {
            status: incoming.statusCode ?? 0,
            headers: incoming.headers,
            url: url.href,
          },
          body: method === "HEAD" ? "" : Buffer.concat(chunks).toString("utf8"),
        })
      })
    })

    outgoing.setTimeout(15_000, () => outgoing.destroy(new Error(`Timed out requesting ${url}`)))
    outgoing.on("error", reject)
    outgoing.end()
  })
}

const publicEndpoints = [
  { path: "/", media: "text/html", marker: /id="research"/ },
  { path: "/about", media: "text/html", marker: /Mathematics first, then software/ },
  { path: "/contact", media: "text/html", marker: /Verified channels/ },
  { path: "/privacy", media: "text/html", marker: /Delivery and technical logs/ },
  { path: "/cranked", media: "text/html", marker: /Cranked Mathematics/ },
  { path: "/literature/", media: "text/html", marker: /The Long Inheritance/ },
  { path: "/robots.txt", media: "text/plain", marker: /User-agent:/i },
  { path: "/sitemap.xml", media: "xml", marker: /<urlset\b/ },
  { path: "/llms.txt", media: "text/plain", marker: /^# Monroe Stephenson/m },
  { path: "/agent-instructions.md", media: "text/markdown", marker: /^## When to use this site$/m },
  { path: "/index.md", media: "text/markdown", marker: /^# Monroe Stephenson$/m },
  { path: "/404.md", media: "text/markdown", marker: /^# 404 — Page not found$/m },
]

await Promise.all(publicEndpoints.map(async ({ path, media, marker }) => {
  try {
    const result = await request(path)
    check(result.response.status === 200, `${path}: expected 200, received ${result.response.status}`)

    if (media === "xml") {
      check(/^(?:application|text)\/xml$/.test(mediaType(result.response)), `${path}: expected an XML Content-Type`)
    } else {
      check(mediaType(result.response) === media, `${path}: expected ${media} Content-Type`)
    }

    check(marker.test(result.body), `${path}: expected format/content marker missing`)
  } catch (error) {
    failures.push(`${path}: ${error.message}`)
  }
}))

const auditUserAgents = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  // Google-Extended is a robots token rather than an HTTP User-Agent, but Ora probes it.
  "Google-Extended",
  "DeepSeekBot",
  "ora-agent",
]

await Promise.all(auditUserAgents.map(async (userAgent) => {
  try {
    const { response, body } = await request("/", { headers: { "user-agent": userAgent } })
    check(response.status === 200, `${userAgent}: homepage returned ${response.status}`)
    check(!header(response, "cf-mitigated"), `${userAgent}: Cloudflare mitigation header present`)
    check(!/just a moment|challenge-platform|cf-chl-/i.test(body), `${userAgent}: challenge body returned`)
    check(/<h1\b/i.test(body), `${userAgent}: homepage H1 missing`)
    check(/id="work"/.test(body), `${userAgent}: work section missing`)
    check(/id="research"/.test(body), `${userAgent}: research section missing`)
    check(body.length >= 10_000, `${userAgent}: response is too short to be the rendered homepage`)
  } catch (error) {
    failures.push(`${userAgent}: ${error.message}`)
  }
}))

const probeId = Date.now()
let exactMarkdownResult
const negotiationCases = [
  { label: "Missing Accept", accept: null, expected: "html" },
  { label: "Wildcard Accept", accept: "*/*", expected: "html" },
  { label: "Text wildcard Accept", accept: "text/*", expected: "html" },
  { label: "Browser Accept", accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", expected: "html" },
  { label: "Exact Markdown", accept: "text/markdown", expected: "markdown" },
  { label: "Weighted Markdown", accept: "text/markdown, text/html;q=0.8", expected: "markdown" },
  { label: "Case-insensitive Markdown", accept: "Text/Markdown; q=1, text/html;q=0.5", expected: "markdown" },
  { label: "Weighted HTML", accept: "text/markdown;q=0.4, text/html;q=0.9", expected: "html" },
  { label: "Rejected Markdown", accept: "text/markdown;q=0, text/html", expected: "html" },
]

for (const [index, negotiationCase] of negotiationCases.entries()) {
  const headers = negotiationCase.accept === null ? {} : { accept: negotiationCase.accept }
  const result = await request(`/?accept-case=${probeId}-${index}`, { headers })
  if (negotiationCase.label === "Exact Markdown") exactMarkdownResult = result
  if (negotiationCase.expected === "markdown") {
    checkMarkdown(result, negotiationCase.label)
  } else {
    checkHtml(result, negotiationCase.label)
  }
}

for (const [index, accept] of [
  "application/pdf",
  "text/markdown;q=0, text/html;q=0",
].entries()) {
  const label = index === 0 ? "Unsupported media" : "All representations rejected"
  const result = await request(`/?accept-406=${probeId}-${index}`, { headers: { accept } })
  check(result.response.status === 406, `${label}: expected 406, received ${result.response.status}`)
  check(mediaType(result.response) === "text/plain", `${label}: expected text/plain Content-Type`)
  check(hasUtf8Charset(result.response), `${label}: Content-Type is missing charset=utf-8`)
  checkNegotiatedHeaders(result.response, label)
  check(/text\/html/i.test(result.body), `${label}: response must list text/html`)
  check(/text\/markdown/i.test(result.body), `${label}: response must list text/markdown`)
}

async function runHomepageOrdering(name, sequence) {
  const path = `/?variant-order=${probeId}-${name}`
  const results = []

  for (const [index, expected] of sequence.entries()) {
    const result = await request(path, {
      headers: { accept: expected === "markdown" ? "text/markdown" : "text/html" },
    })
    const label = `${name} request ${index + 1} (${expected})`
    if (expected === "markdown") checkMarkdown(result, label)
    else checkHtml(result, label)
    results.push(result)
  }

  return results
}

const orderingResults = [
  ...await runHomepageOrdering("HTML-first", ["html", "markdown", "html"]),
  ...await runHomepageOrdering("Markdown-first", ["markdown", "html", "markdown"]),
]

async function runMissingOrdering(name, sequence) {
  const path = `/this-path-must-not-exist-${probeId}-${name}`

  for (const [index, expected] of sequence.entries()) {
    const result = await request(path, {
      headers: { accept: expected === "markdown" ? "text/markdown" : "text/html" },
    })
    const label = `${name} 404 request ${index + 1} (${expected})`
    if (expected === "markdown") {
      checkMarkdown(result, label, 404, /sitemap\.xml[\s\S]*llms\.txt/)
    } else {
      checkHtml(result, label, 404, /\/sitemap\.xml[\s\S]*\/llms\.txt/)
    }
  }
}

await runMissingOrdering("HTML-first", ["html", "markdown", "html"])
await runMissingOrdering("Markdown-first", ["markdown", "html", "markdown"])

function parseRobotsGroups(body) {
  const groups = []
  let current = { agents: [], directives: [] }

  const flush = () => {
    if (current.agents.length > 0) groups.push(current)
    current = { agents: [], directives: [] }
  }

  for (const rawLine of body.split(/\r?\n/)) {
    if (/^\s*#/.test(rawLine)) continue
    const line = rawLine.replace(/#.*$/, "").trim()
    if (!line) {
      flush()
      continue
    }

    const match = line.match(/^([^:]+):\s*(.*)$/)
    if (!match) continue
    const field = match[1].trim().toLowerCase()
    const value = match[2].trim()

    if (field === "user-agent") {
      if (current.directives.length > 0) flush()
      current.agents.push(value.toLowerCase())
    } else if (current.agents.length > 0) {
      current.directives.push({ field, value })
    }
  }

  flush()
  return groups
}

const robotsResult = await request("/robots.txt")
check(robotsResult.response.status === 200, `robots.txt: expected 200, received ${robotsResult.response.status}`)
check(mediaType(robotsResult.response) === "text/plain", "robots.txt: expected text/plain Content-Type")

const robotsGroups = parseRobotsGroups(robotsResult.body)
for (const agent of auditUserAgents) {
  const groups = robotsGroups.filter((group) => group.agents.includes(agent.toLowerCase()))
  check(groups.length > 0, `robots.txt: explicit ${agent} group missing`)
  const directives = groups.flatMap((group) => group.directives)
  check(
    directives.some(({ field, value }) => field === "allow" && value === "/"),
    `robots.txt: ${agent} does not explicitly allow the homepage`,
  )
  check(
    !directives.some(({ field, value }) => field === "disallow" && ["/", "/*", "/$"].includes(value)),
    `robots.txt: ${agent} explicitly blocks the homepage`,
  )
}

check(
  robotsGroups.some((group) => group.agents.includes("*") && group.directives.some(
    ({ field, value }) => field === "allow" && value === "/",
  )),
  "robots.txt: wildcard group does not allow the homepage",
)
check(/Sitemap:\s*https:\/\/gramscian\.com\/sitemap\.xml/i.test(robotsResult.body), "robots.txt: sitemap declaration missing")

const expectedContentSignal = process.env.AGENT_EXPECTED_CONTENT_SIGNAL
if (expectedContentSignal && exactMarkdownResult) {
  const normalizeSignal = (value) => value
    .split(",")
    .map((directive) => directive.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join(",")
  check(
    normalizeSignal(header(exactMarkdownResult.response, "content-signal"))
      === normalizeSignal(expectedContentSignal),
    `Content-Signal: expected "${expectedContentSignal}", received "${header(exactMarkdownResult.response, "content-signal") || "missing"}"`,
  )
}

const cacheConfirmed = orderingResults.some(({ response }) => (
  /hit/i.test(header(response, "cf-cache-status"))
  || /hit/i.test(header(response, "x-cache"))
  || Number.parseInt(header(response, "age"), 10) > 0
))

if (failures.length > 0) {
  console.error(`Agent endpoint verification failed for ${baseUrl.origin}:`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Agent endpoint verification passed for ${baseUrl.origin} (${publicEndpoints.length} endpoints, ${auditUserAgents.length} agent tokens).`)
  if (!cacheConfirmed) {
    console.warn("Negotiation request orderings passed, but no cache-hit header was observed; confirm the normalized HTML/Markdown cache keys in Cloudflare analytics.")
  }
}
