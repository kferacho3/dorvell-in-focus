'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * Announces route changes to assistive technology.
 *
 * A client-side navigation replaces the page content without the page-load
 * event a screen reader relies on. Without this, following a link is silent:
 * the reader hears nothing, focus stays where it was, and the only way to
 * discover that anything happened is to start reading again from the top.
 *
 * The announcement is the new document title, read after a short delay so it
 * lands *after* React has committed — announcing the previous title is worse
 * than announcing nothing.
 *
 * `role="status"` with `aria-live="polite"` waits for a pause rather than
 * interrupting, which is right for a navigation the reader initiated.
 */
export function RouteAnnouncer() {
  const pathname = usePathname()
  const [announcement, setAnnouncement] = useState('')
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // Skip the first render: the initial page load is announced by the browser
    // itself, and duplicating it is noise.
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname

    const timer = window.setTimeout(() => {
      const title =
        document.title || document.querySelector('h1')?.textContent || pathname
      setAnnouncement(title)
    }, 120)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only-live">
      {announcement}
    </p>
  )
}
