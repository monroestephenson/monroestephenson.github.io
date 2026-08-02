import type React from "react"
import type { Metadata } from "next"
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
})

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://gramscian.com"),
  title: "Monroe Stephenson",
  description:
    "Backend engineer in Berlin, on Superchat's AI team. Algebraic statistics, network telemetry, and what capability survives under a hard constraint.",
  openGraph: {
    title: "Monroe Stephenson",
    description:
      "Backend engineer in Berlin, on Superchat's AI team. Algebraic statistics, network telemetry, and what capability survives under a hard constraint.",
    url: "https://gramscian.com",
    siteName: "Monroe Stephenson",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable} font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
