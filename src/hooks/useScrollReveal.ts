import { useEffect, useRef } from 'react';

export function useScrollReveal(options?: { threshold?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, options?.delay ?? 0);
          observer.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.delay]);
  return ref;
}
