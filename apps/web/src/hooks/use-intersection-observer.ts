import * as React from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Lightweight IntersectionObserver hook.
 * Returns a ref to attach and a boolean `inView`.
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): [React.RefCallback<T>, boolean] {
  const { threshold = 0, rootMargin = '0px', enabled = true } = options;
  const [inView, setInView] = React.useState(false);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  const ref = React.useCallback(
    (node: T | null) => {
      if (observerRef.current !== null) {
        observerRef.current.disconnect();
      }
      if (!enabled || node === null) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => setInView(entry?.isIntersecting ?? false),
        { threshold, rootMargin },
      );
      observerRef.current.observe(node);
    },
    [enabled, threshold, rootMargin],
  );

  return [ref, inView];
}
