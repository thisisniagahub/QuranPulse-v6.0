import { useRef, useLayoutEffect } from 'react';

/**
 * Always returns a ref containing the latest value.
 * Useful for event handlers in effects that shouldn't re-subscribe.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
