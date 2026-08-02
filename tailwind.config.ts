import type { Config } from "tailwindcss"

/**
 * Colors resolve through CSS custom properties so `.dark` flips the whole
 * system at the token level. That keeps `dark:` prefixes out of the components
 * almost entirely — the negative is defined once, in globals.css.
 */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        critical: "rgb(var(--critical) / <alpha-value>)",

        // sandpile grain states, 0–3
        s0: "rgb(var(--s0) / <alpha-value>)",
        s1: "rgb(var(--s1) / <alpha-value>)",
        s2: "rgb(var(--s2) / <alpha-value>)",
        s3: "rgb(var(--s3) / <alpha-value>)",

        // shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-plex-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        hero: ["var(--t-hero)", { lineHeight: "0.94", letterSpacing: "-0.03em" }],
        h2: ["var(--t-h2)", { lineHeight: "1.04", letterSpacing: "-0.022em" }],
        h3: ["var(--t-h3)", { lineHeight: "1.2", letterSpacing: "-0.012em" }],
        body: ["var(--t-body)", { lineHeight: "1.65" }],
        meta: ["var(--t-meta)", { lineHeight: "1.5" }],
        micro: ["var(--t-micro)", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      maxWidth: {
        measure: "62ch",
        page: "78rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
