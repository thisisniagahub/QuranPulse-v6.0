/**
 * Jest Setup File for QuranPulse v6.0
 * 
 * Global test configuration and mocks
 */

import '@testing-library/jest-dom';
import { mockIntersectionObserver, mockMatchMedia, mockLocalStorage } from './test-utils';

// ============================================
// GLOBAL MOCKS
// ============================================

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock IntersectionObserver
beforeAll(() => {
    mockIntersectionObserver();
    mockMatchMedia();
    mockLocalStorage();
});

// ============================================
// CONSOLE SUPPRESSION
// ============================================

// Suppress specific console errors/warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = (...args: unknown[]) => {
        // Suppress React 18 act warnings and other expected warnings
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: ReactDOM.render') ||
                args[0].includes('Not implemented: navigation'))
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.warn = (...args: unknown[]) => {
        // Suppress specific warnings
        if (
            typeof args[0] === 'string' &&
            args[0].includes('componentWillReceiveProps')
        ) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});

// ============================================
// CLEANUP
// ============================================

afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
});
