import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for tracking element size using ResizeObserver
 * Returns ref to attach to element and current size
 * Optimized with debouncing to reduce update frequency
 */
export function useSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Create ResizeObserver with requestAnimationFrame debouncing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      
      // Cancel previous frame if still pending
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Schedule update for next animation frame
      rafRef.current = requestAnimationFrame(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        
        // Only update if dimensions actually changed significantly (> 5px)
        setSize((prevSize) => {
          if (
            Math.abs(prevSize.width - width) > 5 ||
            Math.abs(prevSize.height - height) > 5
          ) {
            return { width, height };
          }
          return prevSize;
        });
      });
    });

    // Start observing
    resizeObserver.observe(element);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, size };
}

/**
 * Hook variant that waits for minimum width before marking as ready
 * Useful for preventing chart render until container has proper dimensions
 */
export function useSizeReady(minWidth = 100) {
  const { ref, size } = useSize();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (size.width >= minWidth && !isReady) {
      setIsReady(true);
    }
  }, [size.width, minWidth, isReady]);

  return { ref, size, isReady };
}
