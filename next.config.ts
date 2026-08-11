import { withPayload } from '@payloadcms/next/withPayload'
import bundleAnalyzer from '@next/bundle-analyzer'

import type { NextConfig } from 'next'

/**
 * Carried forward from the current dorvellferguson.com configuration as a
 * *principle*, not a copy: modern output formats plus versioned, immutable
 * derivatives. Legacy routes and public-bucket assumptions are deliberately
 * not reproduced here (plan §2.2.3).
 */
const IMMUTABLE = 'public, max-age=31536000, immutable'

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_URL
  ? new URL(process.env.NEXT_PUBLIC_MEDIA_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31_536_000,
    // Widths matched to the layout breakpoints in styles/tokens.css so we never
    // ship a 4K source into a 320px card (plan §11.3).
    deviceSizes: [320, 480, 768, 1024, 1440, 1920, 2560],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: mediaHost
      ? [{ protocol: 'https', hostname: mediaHost }]
      : [],
  },

  experimental: {
    // Payload's admin bundle is large; keep it out of the reader's critical path.
    optimizePackageImports: ['@payloadcms/ui'],
  },

  async headers() {
    return [
      {
        // Derivative object keys are content-hashed, so they can never change
        // meaning under a cached URL.
        source: '/media/derivatives/:path*',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // The admin panel must never be indexed (plan §13.3).
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

export default withBundleAnalyzer(withPayload(nextConfig, { devBundleServerPackages: false }))
