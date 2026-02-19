/**
 * Test Utilities for QuranPulse v6.0
 * 
 * Common testing patterns and helpers for React Testing Library
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// ============================================
// ALL PROVIDERS WRAPPER
// ============================================

interface AllProvidersProps {
    children: React.ReactNode;
}

/**
 * Wraps components with all necessary providers for testing
 */
const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
    return (
        <BrowserRouter>
            {/* Add more providers as needed: Theme, Auth, Query, etc. */}
            {children}
        </BrowserRouter>
    );
};

// ============================================
// CUSTOM RENDER
// ============================================

/**
 * Custom render function that wraps components with providers
 * Use this instead of RTL's render for component testing
 */
const customRender = (ui: React.ReactElement, options = {}) => {
    return render(ui, { wrapper: AllProviders, ...options });
};

// ============================================
// MOCK UTILITIES
// ============================================

/**
 * Mock IntersectionObserver for testing lazy loading
 */
export const mockIntersectionObserver = (): void => {
    const mockObserver = jest.fn();
    mockObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockObserver as unknown as typeof IntersectionObserver;
};

/**
 * Mock matchMedia for testing responsive/motion preferences
 */
export const mockMatchMedia = (matches: boolean = false): void => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
            matches,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
};

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = (): void => {
    const storage: Record<string, string> = {};

    const localStorageMock = {
        getItem: jest.fn((key: string) => storage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            storage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete storage[key];
        }),
        clear: jest.fn(() => {
            Object.keys(storage).forEach(key => delete storage[key]);
        }),
        get length() {
            return Object.keys(storage).length;
        },
        key: jest.fn((index: number) => Object.keys(storage)[index] || null),
    };

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
    });
};

// ============================================
// ASYNC UTILITIES
// ============================================

/**
 * Wait for specified milliseconds
 */
export const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Wait for next tick
 */
export const waitForNextTick = (): Promise<void> => {
    return new Promise(resolve => process.nextTick(resolve));
};

// ============================================
// RE-EXPORTS
// ============================================

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render };
