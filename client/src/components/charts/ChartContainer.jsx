import React, { useEffect, useRef, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import { useResizeObserver } from '../hooks/useResizeObserver';

/**
 * Universal ChartContainer wrapper for consistent chart sizing
 * Handles responsive behavior, accordion state changes, and resize events
 */
const ChartContainer = ({
  children,
  minHeight = 320, // Desktop default
  maxHeight,
  className = '',
  onResize,
  maintainAspectRatio = false,
  aspectRatio = 16 / 9
}) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Responsive min-height based on screen size
  const getResponsiveMinHeight = useCallback(() => {
    if (typeof window === 'undefined') return minHeight;
    
    const width = window.innerWidth;
    if (width < 768) return Math.max(240, minHeight * 0.75); // Mobile
    if (width < 1024) return Math.max(280, minHeight * 0.85); // Tablet
    return minHeight; // Desktop
  }, [minHeight]);

  // Debounced resize handler
  const handleResize = useCallback(
    (entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (entries && entries[0] && onResize) {
          const { width, height } = entries[0].contentRect;
          onResize({ width, height });
        }
      }, 100); // 100ms debounce
    },
    [onResize]
  );

  // Use resize observer hook
  useResizeObserver(containerRef, handleResize);

  // Handle window resize events (including accordion expand/collapse)
  useEffect(() => {
    const handleWindowResize = () => {
      if (containerRef.current && onResize) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('ChartContainer resize:', { width: rect.width, height: rect.height });
        onResize({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [onResize]);

  // Calculate responsive height
  const responsiveMinHeight = getResponsiveMinHeight();
  const calculatedHeight = maintainAspectRatio && containerRef.current
    ? containerRef.current.offsetWidth / aspectRatio
    : responsiveMinHeight;

  const finalHeight = maxHeight 
    ? Math.min(calculatedHeight, maxHeight)
    : calculatedHeight;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: `${responsiveMinHeight}px`,
        height: maintainAspectRatio ? `${finalHeight}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        position: 'relative',
        overflow: 'hidden',
        // Smooth transitions for height changes
        transition: theme.transitions.create(['height', 'min-height'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),
        // Ensure proper sizing context for children
        '& > *': {
          flex: 1,
          minHeight: 0, // Allow flex children to shrink
        },
        // Chart-specific styles
        '& .recharts-wrapper': {
          width: '100% !important',
          height: '100% !important',
        },
        '& .recharts-surface': {
          overflow: 'visible', // Prevent legend clipping
        },
      }}
    >
      {/* Chart content area */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ChartContainer;