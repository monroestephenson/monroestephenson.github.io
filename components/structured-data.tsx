import {
  contactEmail,
  profileImage,
  siteDescription,
  siteName,
  siteUrl,
  socialProfiles,
} from "@/lib/site"

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      alternateName: "gramscian.com",
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: siteName,
      url: `${siteUrl}/`,
      image: `${siteUrl}${profileImage}`,
      description: siteDescription,
      email: `mailto:${contactEmail}`,
      jobTitle: "Backend engineer",
      homeLocation: {
        "@type": "Place",
        name: "Berlin, Germany",
      },
      sameAs: socialProfiles,
      knowsAbout: [
        "Backend engineering",
        "Distributed systems",
        "Network telemetry",
        "Algebraic statistics",
        "Combinatorics",
        "AI-assisted mathematical research",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: `${siteUrl}/`,
      name: `${siteName} — personal site`,
      description: siteDescription,
      inLanguage: "en",
      mainEntity: { "@id": `${siteUrl}/#person` },
      isPartOf: { "@id": `${siteUrl}/#website` },
      dateModified: "2026-08-26",
    },
  ],
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  )
}
