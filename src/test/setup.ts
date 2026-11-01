import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

import "@testing-library/jest-dom/vitest"

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  constructor(private callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    )
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

globalThis.ResizeObserver = ResizeObserverStub
globalThis.IntersectionObserver =
  IntersectionObserverStub as unknown as typeof IntersectionObserver

afterEach(() => {
  cleanup()
})
