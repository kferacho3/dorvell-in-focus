'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ChannelNav } from '@/components/navigation/ChannelNav'
import { DURATION, ms } from '@/lib/motion/tokens'

import type { ResolvedChannel } from '@/lib/cms/channel-settings'
import type { ThemeKey } from '@/lib/channels'

/**
 * Module A — the Aperture Menu.
 *
 * This is a `<details>` element that has been *enhanced*, not replaced. The
 * server sends a working native disclosure; before hydration, after a failed
 * chunk, and with JavaScript off, clicking the summary opens the menu because
 * the browser does that. Everything below only makes it nicer.
 *
 * The idea worth borrowing from the source (EaseReverseClipMenu) is not the
 * clip-path — it is that the animation stays smooth when someone changes their
 * mind halfway through. Most menus only look right if the interaction is never
 * interrupted.
 *
 * That is why this uses the Web Animations API rather than CSS transitions or a
 * timeline library: `Animation.reverse()` continues from the current playback
 * position by definition. Reversing a half-open menu resumes from 50%, not from
 * the start, with no manual progress bookkeeping to get wrong.
 */

type MenuState = 'closed' | 'opening' | 'open' | 'closing'

type ApertureMenuProps = {
  channels: readonly ResolvedChannel[]
  current: ThemeKey
}

const SECONDARY_LINKS = [
  { href: '/search', label: 'Search' },
  { href: '/tags', label: 'Tags' },
  { href: '/archive', label: 'Archive' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/about', label: 'About' },
  { href: '/policies', label: 'Policies' },
] as const

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ApertureMenu({ channels, current }: ApertureMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const summaryRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  /**
   * Generation counter for in-flight transitions.
   *
   * `Animation.finished` is a single promise shared by every handler attached
   * to it. Reversing does not replace it — so without this, a close handler
   * registered before a reopen still fires when the animation completes
   * *forward*, and slams the menu shut a frame after it finished opening.
   *
   * Every open/close claims the next id; a handler whose id is stale returns
   * without touching state.
   */
  const transitionId = useRef(0)

  const [state, setState] = useState<MenuState>('closed')
  const isOpen = state === 'opening' || state === 'open'

  const prefersReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return true
    if (document.documentElement.dataset.motion === 'reduced') return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /**
   * Builds the reveal. The clip circle is centred on the trigger's real
   * position, so the menu appears to grow out of the control that was pressed
   * rather than from an assumed corner.
   */
  const buildAnimation = useCallback((): Animation | null => {
    const panel = panelRef.current
    const summary = summaryRef.current
    if (!panel || !summary) return null

    const panelRect = panel.getBoundingClientRect()
    const summaryRect = summary.getBoundingClientRect()

    const originX = summaryRect.left + summaryRect.width / 2 - panelRect.left
    const originY = summaryRect.top + summaryRect.height / 2 - panelRect.top

    // Far enough to cover the panel from any origin.
    const radius = Math.hypot(
      Math.max(originX, panelRect.width - originX),
      Math.max(originY, panelRect.height - originY),
    )

    return panel.animate(
      [
        { clipPath: `circle(0px at ${originX}px ${originY}px)`, opacity: 0 },
        { clipPath: `circle(${radius}px at ${originX}px ${originY}px)`, opacity: 1 },
      ],
      {
        duration: ms(DURATION.route),
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      },
    )
  }, [])

  const open = useCallback(() => {
    const details = detailsRef.current
    if (!details) return

    const id = ++transitionId.current
    const isCurrent = () => transitionId.current === id

    details.open = true

    if (prefersReducedMotion()) {
      setState('open')
      return
    }

    setState('opening')

    const settleOpen = () => {
      if (isCurrent()) setState('open')
    }

    // Resuming an in-flight closing animation continues from where it is,
    // rather than snapping to the start.
    const existing = animationRef.current
    if (existing && existing.playState !== 'finished') {
      existing.playbackRate = 1
      existing.play()
      existing.finished.then(settleOpen, settleOpen)
      return
    }

    // Wait a frame so the panel has been laid out and its rect is real.
    requestAnimationFrame(() => {
      if (!isCurrent()) return

      const animation = buildAnimation()
      if (!animation) {
        settleOpen()
        return
      }
      animationRef.current = animation
      animation.finished.then(settleOpen, settleOpen)
    })
  }, [buildAnimation, prefersReducedMotion])

  const close = useCallback(() => {
    const details = detailsRef.current
    if (!details) return

    const id = ++transitionId.current
    const isCurrent = () => transitionId.current === id

    if (prefersReducedMotion()) {
      animationRef.current?.cancel()
      animationRef.current = null
      details.open = false
      setState('closed')
      return
    }

    setState('closing')

    const animation = animationRef.current
    if (!animation) {
      details.open = false
      setState('closed')
      return
    }

    // Reversing continues from the current position — a menu closed while 40%
    // open runs back from 40%, not from fully open.
    animation.playbackRate = -1
    animation.play()

    const settleClosed = () => {
      // A reopen claimed a newer id while this was running. It owns the state.
      if (!isCurrent()) return
      details.open = false
      animationRef.current = null
      setState('closed')
    }

    animation.finished.then(settleClosed, settleClosed)
  }, [prefersReducedMotion])

  const toggle = useCallback(
    (event: React.MouseEvent) => {
      // Take over from the native toggle so the closing animation can run
      // before the browser hides the content.
      event.preventDefault()
      if (state === 'open' || state === 'opening') close()
      else open()
    },
    [state, open, close],
  )

  // Escape always closes, and focus returns to the trigger.
  useEffect(() => {
    if (state === 'closed') return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        summaryRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      // Focus stays inside the open menu. Without this, Tab walks into the
      // page behind it, which for a screen-reader user reads as the menu
      // having silently vanished.
      const panel = panelRef.current
      if (!panel) return

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable.at(-1)!
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === summaryRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [state, close])

  // Move focus into the menu once it is actually open.
  useEffect(() => {
    if (state !== 'open') return
    const firstLink = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    firstLink?.focus()
  }, [state])

  // A click outside closes, matching what the native element does on platforms
  // that implement light dismiss.
  useEffect(() => {
    if (state === 'closed' || state === 'closing') return

    function onPointerDown(event: PointerEvent) {
      const details = detailsRef.current
      if (!details) return
      if (event.target instanceof Node && details.contains(event.target)) return
      close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [state, close])

  useEffect(() => {
    return () => {
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [])

  return (
    <details
      ref={detailsRef}
      data-aperture-menu
      data-state={state}
      className="relative lg:hidden"
      // Never let React control `open` — the element must keep working before
      // hydration, and a controlled value would fight the browser's own toggle.
      onToggle={(event) => {
        // Fires when the browser toggles it without our handler, e.g. a
        // keyboard activation the click handler did not intercept.
        const nativeOpen = (event.currentTarget as HTMLDetailsElement).open
        if (nativeOpen && state === 'closed') setState('open')
        if (!nativeOpen && (state === 'open' || state === 'opening')) setState('closed')
      }}
    >
      <summary
        ref={summaryRef as React.RefObject<HTMLElement>}
        onClick={toggle}
        aria-expanded={isOpen}
        className="type-kicker flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-2 [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only-live">{isOpen ? 'Close' : 'Open'} navigation menu</span>
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="bg-channel-fg block h-px w-5" />
          <span className="bg-channel-fg block h-px w-5" />
        </span>
        <span aria-hidden>Menu</span>
      </summary>

      <div
        ref={panelRef}
        // `inert` while closing so the content cannot be tabbed into or read
        // while it is on its way out.
        inert={state === 'closing' ? true : undefined}
        className="bg-channel-bg border-channel-rule absolute top-full right-0 mt-px w-64 border p-5 shadow-(--shadow-lifted)"
      >
        <ChannelNav channels={channels} current={current} />

        <ul className="border-channel-rule mt-5 space-y-3 border-t pt-5">
          {SECONDARY_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="type-kicker">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
