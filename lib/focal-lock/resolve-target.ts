const TARGET_SELECTOR = '[data-focus-target]:not([data-focus-disabled="true"])'

/** Resolve nested targets by declared priority, then by the deepest element. */
export function resolveFocusTarget(start: Element | null): HTMLElement | null {
  const candidates: Array<{ element: HTMLElement; priority: number; depth: number }> = []
  let current: Element | null = start
  let depth = 0

  while (current && current !== document.documentElement) {
    if (current.matches(TARGET_SELECTOR) && current instanceof HTMLElement) {
      const priority = Number(current.dataset.focusPriority ?? 0)
      candidates.push({
        element: current,
        priority: Number.isFinite(priority) ? priority : 0,
        depth,
      })
    }
    current = current.parentElement
    depth += 1
  }

  candidates.sort((a, b) => b.priority - a.priority || a.depth - b.depth)
  return candidates[0]?.element ?? null
}

export function resolveRouteDefault(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(
      `${TARGET_SELECTOR}[data-focus-default="true"]`,
    ) ??
    document.querySelector<HTMLElement>(`${TARGET_SELECTOR}[aria-current="page"]`) ??
    document.querySelector<HTMLElement>('[data-site-logo][data-focus-target]')
  )
}
