import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://gramscian.com/",
      lastModified: "2026-08-26",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://gramscian.com/about",
      lastModified: "2026-08-26",
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://gramscian.com/contact",
      lastModified: "2026-08-26",
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: "https://gramscian.com/privacy",
      lastModified: "2026-08-26",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://gramscian.com/cranked",
      lastModified: "2026-08-26",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://gramscian.com/literature/",
      lastModified: "2026-08-26",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
}
