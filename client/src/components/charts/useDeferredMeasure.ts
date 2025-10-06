import { useEffect, useRef, useState } from "react";

/**
 * Hook that defers chart rendering until container is properly sized
 * Uses ResizeObserver to detect when container has meaningful dimensions
 * This prevents charts from rendering incorrectly when mounted off-screen (e.g., in collapsed accordions)
 */
export function useDeferredMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      
      const width = Math.floor(entry.contentRect.width);
      const height = Math.floor(entry.contentRect.height);
      
      setRect({ w: width, h: height });
      
      // Chart is ready to render when it has meaningful width
      // 120px minimum to ensure charts have space to render properly
      if (width > 120) {
        setReady(true);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { 
    ref, 
    rect, 
    ready,
    width: rect.w,
    height: rect.h
  };
}