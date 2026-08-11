import '@testing-library/jest-dom/vitest'

import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

/**
 * jsdom implements neither `matchMedia` nor `IntersectionObserver`, and the
 * capability layer reads both to decide a motion tier. Without these stubs,
 * every component that respects reduced motion would throw in unit tests —
 * which would quietly push us toward not testing the reduced-motion paths at
 * all. Those are the paths most likely to regress.
 */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }),
  })
}

/**
 * Working `localStorage`.
 *
 * Node 25 ships an experimental `localStorage` global. Under Vitest's jsdom
 * environment it shadows jsdom's own `Storage` and lands on `window` as a
 * plain object with no methods — Node emits a `--localstorage-file was
 * provided without a valid path` warning to match. Real browsers are
 * unaffected, so this is purely a test-environment gap.
 *
 * Methods live on a prototype so `vi.spyOn` can replace them, which is how the
 * motion-preference suite simulates storage throwing in private browsing.
 */
class MemoryStorage implements Storage {
  #entries = new Map<string, string>()

  get length(): number {
    return this.#entries.size
  }

  key(index: number): string | null {
    return [...this.#entries.keys()][index] ?? null
  }

  getItem(key: string): string | null {
    return this.#entries.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.#entries.set(key, String(value))
  }

  removeItem(key: string): void {
    this.#entries.delete(key)
  }

  clear(): void {
    this.#entries.clear()
  }
}

if (typeof window.localStorage?.clear !== 'function') {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: new MemoryStorage(),
  })
}

if (!('IntersectionObserver' in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: readonly number[] = []
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  })
}
