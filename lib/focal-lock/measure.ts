import type { FocusBounds } from '@/components/focal-lock/focal-lock.types'

const DEFAULT_INSET = 8

function finiteNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function measureFocusTarget(element: HTMLElement): FocusBounds {
  const rect = element.getBoundingClientRect()
  const inset = Math.max(0, finiteNumber(element.dataset.focusInset, DEFAULT_INSET))
  const radius = Math.max(0, finiteNumber(element.dataset.focusRadius, 0))
  const shortestEdge = Math.min(rect.width, rect.height)

  return {
    x: rect.left - inset,
    y: rect.top - inset,
    width: rect.width + inset * 2,
    height: rect.height + inset * 2,
    radius,
    cornerLength: Math.max(18, Math.min(24, shortestEdge * 0.18)),
  }
}
