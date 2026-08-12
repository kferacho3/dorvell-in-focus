'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

import { TRANSITION_FAILSAFE_MS } from '@/lib/motion/tokens'

/**
 * Module C — Shared Story Frame.
 *
 * The selected photograph appears to travel with the reader from a card to the
 * story it opens.
 *
 * Three decisions worth stating, because each one is where this pattern usually
 * goes wrong:
 *
 * 1. **One event listener, not a client component per card.** Cards stay server
 *    components. This island attaches to markup that already works, so a failed
 *    chunk costs an effect, never a destination.
 *
 * 2. **One constant transition name, assigned at click time.** The obvious
 *    approach — a per-story name baked into every card — breaks the moment a
 *    story appears twice on a page, because `view-transition-name` must be
 *    unique in the document or the browser aborts the whole transition. Here
 *    exactly one element carries `story-frame` at any moment: the image inside
 *    the link that was actually clicked.
 *
 * 3. **Navigation starts regardless.** The transition wraps the navigation; it
 *    never gates it. If the View Transition API is missing, the reader prefers
 *    reduced motion, or the animation stalls past the failsafe, the browser
 *    navigates normally. A transition that can strand someone is worse than no
 *    transition.
 */

const FRAME_NAME = 'story-frame'

type ViewTransitionCapableDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>
    skipTransition: () => void
  }
}

export function SharedStoryFrame() {
  const router = useRouter()
  const pathname = usePathname()

  /** Resolves once the router has committed the destination route. */
  const pendingNavigation = useRef<(() => void) | null>(null)
  /** The element currently carrying the transition name, so it can be cleared. */
  const taggedElement = useRef<HTMLElement | null>(null)

  // The router does not expose a navigation promise, so the transition callback
  // waits on a pathname change instead.
  useEffect(() => {
    pendingNavigation.current?.()
    pendingNavigation.current = null
  }, [pathname])

  const clearTag = useCallback(() => {
    if (taggedElement.current) {
      taggedElement.current.style.removeProperty('view-transition-name')
      taggedElement.current = null
    }
  }, [])

  useEffect(() => {
    const doc = document as ViewTransitionCapableDocument

    function onClick(event: MouseEvent) {
      // Let the browser handle anything that is not a plain left click: new
      // tabs, downloads, and context menus must keep working.
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      if (link.target && link.target !== '_self') return
      if (link.origin !== window.location.origin) return

      // Only story links participate.
      const href = link.pathname + link.search
      if (!href.startsWith('/story/')) return

      if (typeof doc.startViewTransition !== 'function') return

      // The resolved preference, written to <html> before first paint.
      if (document.documentElement.dataset.motion === 'reduced') return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const frame = link.querySelector<HTMLElement>('[data-story-frame]')
      if (!frame) return

      event.preventDefault()

      clearTag()
      frame.style.setProperty('view-transition-name', FRAME_NAME)
      taggedElement.current = frame

      let settled = false
      const settle = () => {
        if (settled) return
        settled = true
        pendingNavigation.current = null
        clearTag()
      }

      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pendingNavigation.current = resolve
            router.push(href)

            // Hard stop. A slow route or a dropped chunk must not leave the
            // document frozen mid-transition (plan §5.4).
            window.setTimeout(() => {
              if (pendingNavigation.current) {
                pendingNavigation.current = null
                resolve()
              }
            }, TRANSITION_FAILSAFE_MS)
          }),
      )

      transition.finished.then(settle, settle)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      clearTag()
    }
  }, [router, clearTag])

  return null
}
