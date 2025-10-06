import { useEffect } from 'react';

/**
 * Custom hook for ResizeObserver
 * Observes element size changes and calls callback
 */
export const useResizeObserver = (ref, callback) => {
  useEffect(() => {
    if (!ref.current || !callback) return;

    // Create ResizeObserver instance
    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        callback(entries);
      });
    });

    // Start observing
    observer.observe(ref.current);

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
};