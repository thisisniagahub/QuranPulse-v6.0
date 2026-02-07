/**
 * usePerformance Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { useDebounce, useThrottle, useLocalStorage, usePrefersReducedMotion } from './usePerformance';

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 300));
        expect(result.current).toBe('initial');
    });

    it('debounces value changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: 'initial' } }
        );

        rerender({ value: 'updated' });
        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current).toBe('updated');
    });
});

describe('useThrottle', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useThrottle('initial', 100));
        expect(result.current).toBe('initial');
    });

    it('throttles rapid value changes', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useThrottle(value, 100),
            { initialProps: { value: 'v1' } }
        );

        // First update should go through
        rerender({ value: 'v2' });
        expect(result.current).toBe('v2');

        // Rapid updates within interval should be throttled
        rerender({ value: 'v3' });
        expect(result.current).toBe('v2');
    });
});

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns initial value when no stored value', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        expect(result.current[0]).toBe('default');
    });

    it('persists value to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(localStorage.getItem('test-key')).toBe('"new-value"');
    });

    it('returns stored value on mount', () => {
        localStorage.setItem('test-key', '"stored"');

        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        expect(result.current[0]).toBe('stored');
    });
});

describe('usePrefersReducedMotion', () => {
    it('returns false by default', () => {
        const { result } = renderHook(() => usePrefersReducedMotion());
        expect(result.current).toBe(false);
    });
});
