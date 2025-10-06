import { useState, useEffect, useRef } from 'react';

interface DeferredMeasure {
  ref: React.RefObject<HTMLDivElement>;
  ready: boolean;
  width: number;
  height: number;
}

export const useDeferredMeasure = (): DeferredMeasure => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        if (!ready && width > 0 && height > 0) {
          // Small delay to ensure DOM is fully ready
          setTimeout(() => setReady(true), 50);
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ready]);

  return {
    ref,
    ready,
    width: dimensions.width,
    height: dimensions.height
  };
};