import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup après chaque test
afterEach(() => {
  cleanup()
})

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock de PointerEvent pour Radix UI
global.PointerEvent = class PointerEvent extends Event {
  button: number
  ctrlKey: boolean
  pointerType: string

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params)
    this.button = params.button || 0
    this.ctrlKey = params.ctrlKey || false
    this.pointerType = params.pointerType || 'mouse'
  }
} as any

// Mock de hasPointerCapture et setPointerCapture pour Radix UI
Object.defineProperty(Element.prototype, 'hasPointerCapture', {
  value: vi.fn().mockReturnValue(false),
})

Object.defineProperty(Element.prototype, 'setPointerCapture', {
  value: vi.fn(),
})

Object.defineProperty(Element.prototype, 'releasePointerCapture', {
  value: vi.fn(),
})

// Mock de scrollIntoView pour Radix UI
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
})
