import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

// Keep the animation library off the initial mobile/reduced-motion download path.
export function useGsapScrollTrigger(dependencies: unknown[] = []) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;
    void import('./gsapEffects').then(({ setupGsapEffects }) => {
      if (!cancelled) dispose = setupGsapEffects();
    }).catch(() => {
      // The site remains usable without optional visual effects.
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [prefersReducedMotion, ...dependencies]);
}
