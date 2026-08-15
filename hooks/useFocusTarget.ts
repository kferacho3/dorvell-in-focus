'use client'

import { useEffect, useMemo, useRef } from 'react'

import { registerFocusTarget } from '@/lib/focal-lock/registry'

import type { FocusTargetOptions } from '@/components/focal-lock/focal-lock.types'

/** Opt-in API for client components; server components can use the same data contract. */
export function useFocusTarget<T extends HTMLElement = HTMLElement>(
  options: FocusTargetOptions,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    return registerFocusTarget(options.id, ref.current)
  }, [options.id])

  const focusProps = useMemo(
    () => ({
      'data-focus-target': true,
      'data-focus-id': options.id,
      'data-focus-label': options.label,
      'data-focus-theme': options.theme,
      'data-focus-inset': options.inset,
      'data-focus-radius': options.radius,
      'data-focus-priority': options.priority,
      'data-focus-default': options.routeDefault || undefined,
      'data-focus-point': options.showPoint || undefined,
      'data-focus-disabled': options.disabled || undefined,
    }),
    [options],
  )

  return { ref, focusProps } as const
}
