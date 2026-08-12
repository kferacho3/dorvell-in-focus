import { cn } from '@/lib/utils/cn'

import type { SocialKey } from '@/lib/social'

/**
 * Social marks, drawn to the publication's line.
 *
 * These are **not** the platforms' brand logos. Dropping in five filled,
 * multi-coloured corporate glyphs would put the loudest thing on the page in
 * the corner reserved for the quietest, and would be the one place the
 * publication stopped looking like itself.
 *
 * Instead each platform is reduced to its recognisable geometry and redrawn at
 * the same weight as the FocusMark: 1.25px stroke on a 24-unit grid, no fills,
 * square caps. At 18–20px they read as a set — closer to a printer's dingbat
 * row than an app tray.
 *
 * Every icon is decorative. The accessible name lives on the link, because a
 * reader needs "FERG Photography on Instagram", not "Instagram".
 */

type SocialIconProps = {
  name: SocialKey
  className?: string
}

const STROKE = 1.25

export function SocialIcon({ name, className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-[1.15em] w-[1.15em]', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}

/**
 * Geometry per platform. Kept deliberately spare — a thin outline of the
 * silhouette people already recognise, with the decorative interior removed.
 */
const PATHS: Record<SocialKey, React.ReactNode> = {
  // Instagram: the frame, the lens, and the highlight. Both accounts share it.
  instagramPhotography: (
    <>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="16.9" cy="7.1" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),
  instagramPersonal: (
    <>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="16.9" cy="7.1" r="0.85" fill="currentColor" stroke="none" />
    </>
  ),

  // TikTok: the note stem falling into its rounded head, with the flag away.
  tiktok: (
    <>
      <path d="M13.6 3.2v11.15a3.6 3.6 0 1 1-3.6-3.6" strokeLinecap="round" />
      <path d="M13.6 3.2c.35 2.6 2.1 4.2 4.7 4.45" strokeLinecap="round" />
    </>
  ),

  // Facebook: the f, drawn as a stroke rather than a filled roundel.
  facebook: (
    <>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.5" />
      <path d="M14.9 8.4h-1.3c-.8 0-1.3.5-1.3 1.3v1.5" strokeLinecap="round" />
      <path d="M12.3 11.2v5.4" strokeLinecap="round" />
      <path d="M10.2 12.5h4.1" strokeLinecap="round" />
    </>
  ),

  // LinkedIn: the in, reduced to a dot, a stem, and the shoulder.
  linkedin: (
    <>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="2.5" />
      <circle cx="8.1" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8.1 10.9v6" strokeLinecap="round" />
      <path d="M12 16.9v-3.4a2.2 2.2 0 0 1 4.4 0v3.4" strokeLinecap="round" />
      <path d="M12 10.9v6" strokeLinecap="round" />
    </>
  ),
}
