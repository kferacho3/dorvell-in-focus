import { Geist, IBM_Plex_Mono, Instrument_Serif } from 'next/font/google'

import { MOTION_PREFERENCE_SCRIPT } from '@/lib/motion/preference'

import type { Metadata, Viewport } from 'next'

import '../globals.css'

/**
 * `next/font` self-hosts and subsets these at build time, so there is no
 * third-party font request at runtime and no FOUT from a blocking stylesheet.
 * `display: swap` plus a metric-matched fallback keeps the layout stable while
 * the real face arrives (plan §11.5).
 *
 * These are prototype faces. A licensed editorial serif and grotesk replace
 * them after brand approval — which is why every reference goes through the
 * `--font-*` custom properties in styles/tokens.css rather than naming a family
 * at a call site.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
})

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  fallback: ['system-ui', 'sans-serif'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
  fallback: ['ui-monospace', 'SF Mono', 'monospace'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FERG IN FOCUS — Life through a creative lens',
    template: '%s · FERG IN FOCUS',
  },
  description:
    'The independent visual publication of Dorvell Ferguson Jr. Photographs, films, reporting, modeling, and collaborations, told as complete stories.',
  applicationName: 'FERG IN FOCUS',
  authors: [{ name: 'Dorvell Ferguson Jr.' }],
  creator: 'Dorvell Ferguson Jr.',
  openGraph: {
    type: 'website',
    siteName: 'FERG IN FOCUS',
    locale: 'en_US',
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f0d' },
  ],
  colorScheme: 'light',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geist.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Resolves the motion preference before first paint. Without it, a
         * reader who chose "reduced" sees one frame of full motion on every
         * navigation — precisely the thing they asked not to see.
         *
         * suppressHydrationWarning above is required because this script
         * mutates <html> before React reconciles it.
         */}
        <script
          dangerouslySetInnerHTML={{ __html: MOTION_PREFERENCE_SCRIPT }}
          suppressHydrationWarning
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
