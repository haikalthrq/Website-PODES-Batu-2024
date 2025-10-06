import React, { useEffect, useRef, useState } from "react";

type Props = {
  render: (size: { width: number; height: number }) => React.ReactNode;
  minHeight?: number;
  className?: string;
  onVisible?: () => void;
};

export default function ChartVisibilityGuard({ 
  render, 
  minHeight = 320, 
  className, 
  onVisible 
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const debugLog = (...args: any[]) => {
    if (import.meta.env?.VITE_VIZ_DEBUG === 'true') {
      console.debug('[ChartVisibilityGuard]', ...args);
    }
  };

  // Intersection Observer for visibility detection
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          debugLog('Chart became visible');
          setVisible(true);
          onVisible?.();
        }
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [onVisible]);

  // Resize Observer for size tracking
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) {
        const newSize = {
          width: Math.max(1, cr.width),
          height: minHeight // Use fixed minHeight instead of dynamic height
        };
        debugLog('Size changed:', newSize);
        setSize(newSize);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [minHeight]);

  const currentSize = size ?? { width: 0, height: minHeight };
  const shouldRender = visible && currentSize.width > 0;

  debugLog('Render state:', { visible, size: currentSize, shouldRender });

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ 
        position: "relative", 
        minHeight,
        width: "100%"
      }}
    >
      {shouldRender ? render(currentSize) : (
        <div style={{ 
          height: minHeight, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#6b7280"
        }}>
          Loading chart...
        </div>
      )}
    </div>
  );
}