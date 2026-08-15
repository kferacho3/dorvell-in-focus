'use client'

import gsap from 'gsap'
import { usePathname } from 'next/navigation'
import { createContext, useCallback, useEffect, useMemo, useRef } from 'react'

import { FocusFrame } from '@/components/focal-lock/FocusFrame'
import { measureFocusTarget } from '@/lib/focal-lock/measure'
import { resolveFocusTarget, resolveRouteDefault } from '@/lib/focal-lock/resolve-target'

type FocalLockContextValue = {
  activateTarget: (element: HTMLElement) => void
}

export const FocalLockContext = createContext<FocalLockContextValue | null>(null)

const ENTRY_SESSION_KEY = 'ferg-focal-lock-entry'
const FOCUS_THEME_ACCENTS: Record<string, string> = {
  publication: '#ff2a2a',
  photography: '#178b7b',
  motion: '#ff2a2a',
  stories: '#bd8733',
  modeling: '#8f6cff',
  x: '#d46a43',
}

function prefersReducedMotion() {
  return (
    document.documentElement.dataset.motion === 'reduced' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * One delegated interaction system and one fixed overlay for the entire site.
 * Content remains server-rendered and fully usable when this enhancement never hydrates.
 */
export function FocalLockProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const frameRef = useRef<HTMLDivElement>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)
  const activeObserverRef = useRef<ResizeObserver | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const modalityRef = useRef<'pointer' | 'keyboard'>('pointer')
  const scrollFrameRef = useRef<number | null>(null)
  const touchScrollTimerRef = useRef<number | null>(null)
  const firstEntryRef = useRef(false)

  useEffect(() => {
    timelineRef.current = gsap.timeline()
    try {
      firstEntryRef.current = !sessionStorage.getItem(ENTRY_SESSION_KEY)
      sessionStorage.setItem(ENTRY_SESSION_KEY, 'seen')
    } catch {
      firstEntryRef.current = false
    }

    return () => {
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [])

  const positionFrame = useCallback((element: HTMLElement, immediate = false) => {
    const frame = frameRef.current
    if (!frame || !element.isConnected || document.hidden) return

    const bounds = measureFocusTarget(element)
    const styles = getComputedStyle(element)
    const ink = styles.getPropertyValue('--channel-fg').trim() || '#111111'
    const accent =
      FOCUS_THEME_ACCENTS[element.dataset.focusTheme ?? ''] ||
      styles.getPropertyValue('--focus-accent').trim() ||
      styles.getPropertyValue('--channel-accent').trim() ||
      '#ff2a2a'
    const surface = styles.getPropertyValue('--channel-bg').trim() || '#f3f0e8'
    const point =
      element.dataset.focusPoint === 'true' ||
      element.getAttribute('aria-current') === 'page'

    frame.style.setProperty('--focus-ink', ink)
    frame.style.setProperty('--focus-accent', accent)
    frame.style.setProperty('--focus-surface', surface)
    frame.style.setProperty('--focus-corner-length', `${bounds.cornerLength}px`)
    frame.style.setProperty('--focus-radius', `${Math.min(bounds.radius, 14)}px`)
    frame.dataset.point = String(point)
    frame.dataset.mode = modalityRef.current

    const label = frame.querySelector<HTMLElement>('.focus-frame__label')
    if (label) label.textContent = element.dataset.focusLabel ?? ''

    const target = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      opacity: 1,
    }

    const reduced = prefersReducedMotion()
    const timeline = timelineRef.current
    if (!timeline || immediate || reduced) {
      timeline?.clear()
      gsap.set(frame, target)
      if (reduced && !immediate) {
        gsap.fromTo(
          frame,
          { opacity: 0.48 },
          { opacity: 1, duration: 0.12, ease: 'none' },
        )
      }
      return
    }

    const corners = frame.querySelectorAll<HTMLElement>('.focus-frame__corner')
    timeline.clear()

    if (firstEntryRef.current) {
      firstEntryRef.current = false
      gsap.set(frame, {
        x: window.innerWidth / 2 - 36,
        y: window.innerHeight / 2 - 36,
        width: 72,
        height: 72,
        opacity: 0,
      })
      timeline
        .to(frame, { opacity: 0.72, duration: 0.14, ease: 'power2.out' })
        .to(frame, { ...target, duration: 0.54, ease: 'power3.out' })
        .fromTo(
          corners,
          { scale: 0.93 },
          { scale: 1, duration: 0.12, ease: 'back.out(1.25)', clearProps: 'transform' },
        )
      return
    }

    timeline
      .to(frame, { ...target, duration: 0.26, ease: 'power3.out', overwrite: 'auto' })
      .fromTo(
        corners,
        { scale: 0.96 },
        {
          scale: 1,
          duration: 0.12,
          ease: 'back.out(1.25)',
          clearProps: 'transform',
          stagger: 0.008,
        },
        '-=0.08',
      )
  }, [])

  const activateTarget = useCallback(
    (element: HTMLElement) => {
      if (element.dataset.focusDisabled === 'true') return
      activeTargetRef.current = element
      activeObserverRef.current?.disconnect()
      activeObserverRef.current = new ResizeObserver(() => positionFrame(element, true))
      activeObserverRef.current.observe(element)
      positionFrame(element)
    },
    [positionFrame],
  )

  useEffect(() => {
    const onPointerMove = () => {
      modalityRef.current = 'pointer'
    }

    const onPointerOver = (event: PointerEvent) => {
      const target =
        event.target instanceof Element ? resolveFocusTarget(event.target) : null
      if (target && modalityRef.current === 'pointer') activateTarget(target)
    }

    const releasePress = () => {
      frameRef.current?.removeAttribute('data-pressed')
    }

    const onPointerDown = (event: PointerEvent) => {
      const target =
        event.target instanceof Element ? resolveFocusTarget(event.target) : null
      if (!target) return
      modalityRef.current = 'pointer'
      frameRef.current?.removeAttribute('data-scrolling')
      activateTarget(target)
      frameRef.current?.setAttribute('data-pressed', 'true')
    }

    const onFocusIn = (event: FocusEvent) => {
      const target =
        event.target instanceof Element ? resolveFocusTarget(event.target) : null
      if (target) activateTarget(target)
    }

    const onMediaPlay = (event: Event) => {
      const target =
        event.target instanceof Element ? resolveFocusTarget(event.target) : null
      if (!target) return
      target.dataset.focusPoint = 'true'
      activateTarget(target)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) {
        modalityRef.current = 'keyboard'
      }
      if ((event.key === 'Enter' || event.key === ' ') && activeTargetRef.current) {
        frameRef.current?.setAttribute('data-pressed', 'true')
      }
    }

    const onScroll = () => {
      const frame = frameRef.current
      const active = activeTargetRef.current
      if (!frame || !active) return

      if (window.matchMedia('(pointer: coarse)').matches) {
        frame.dataset.scrolling = 'true'
        if (touchScrollTimerRef.current) window.clearTimeout(touchScrollTimerRef.current)
        touchScrollTimerRef.current = window.setTimeout(() => {
          frame.removeAttribute('data-scrolling')
          if (active.isConnected) positionFrame(active, true)
        }, 140)
      }

      if (scrollFrameRef.current !== null) return
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null
        if (active.isConnected) positionFrame(active, true)
      })
    }

    const onResize = () => {
      const active = activeTargetRef.current
      if (active?.isConnected) positionFrame(active, true)
    }

    const mutationObserver = new MutationObserver(() => {
      const active = activeTargetRef.current
      if (active && !active.isConnected) {
        const fallback = resolveRouteDefault()
        if (fallback) activateTarget(fallback)
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('play', onMediaPlay, true)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', releasePress)
    window.addEventListener('pointerup', releasePress, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('play', onMediaPlay, true)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', releasePress)
      window.removeEventListener('pointerup', releasePress)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      mutationObserver.disconnect()
      activeObserverRef.current?.disconnect()
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
      if (touchScrollTimerRef.current) window.clearTimeout(touchScrollTimerRef.current)
    }
  }, [activateTarget, positionFrame])

  useEffect(() => {
    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const routeDefault = resolveRouteDefault()
        if (routeDefault) activateTarget(routeDefault)
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [pathname, activateTarget])

  const contextValue = useMemo(() => ({ activateTarget }), [activateTarget])

  return (
    <FocalLockContext.Provider value={contextValue}>
      {children}
      <FocusFrame ref={frameRef} />
    </FocalLockContext.Provider>
  )
}
