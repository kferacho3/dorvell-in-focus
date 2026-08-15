/** One registry for hook-driven targets; data-attribute targets need no setup. */
export const focusTargetRegistry = new Map<string, HTMLElement>()

export function registerFocusTarget(id: string, element: HTMLElement) {
  focusTargetRegistry.set(id, element)

  return () => {
    if (focusTargetRegistry.get(id) === element) focusTargetRegistry.delete(id)
  }
}
