import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() { }
  disconnect() { }
  observe() { }
  unobserve() { }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() { }
  disconnect() { }
  observe() { }
  unobserve() { }
} as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock localStorage
const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: jest.fn((key: string) => (key in storage ? storage[key] : null)),
  setItem: jest.fn((key: string, value: string) => {
    storage[key] = String(value);
  }),
  removeItem: jest.fn((key: string) => {
    delete storage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
  }),
  key: jest.fn((index: number) => Object.keys(storage)[index] ?? null),
  get length() {
    return Object.keys(storage).length;
  },
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock navigator.share
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock indexedDB
const indexedDBMock = {
  open: jest.fn().mockReturnValue({
    result: {
      objectStoreNames: {
        contains: jest.fn(),
      },
      createObjectStore: jest.fn(),
      transaction: jest.fn(),
      close: jest.fn(),
    },
    onupgradeneeded: null,
    onsuccess: null,
    onerror: null,
  }),
};
global.indexedDB = indexedDBMock as any;
