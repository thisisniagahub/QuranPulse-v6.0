/**
 * Schedule non-blocking work after the current task completes.
 * SPA equivalent of Next.js after() — uses requestIdleCallback when available.
 */
export function afterTask(fn: () => void): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(fn);
  } else {
    setTimeout(fn, 0);
  }
}
