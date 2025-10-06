import React, { useMemo, useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Grid } from '@mui/material';
import { donutOptions, barOptions, stackedBarOptions } from './ChartOptions';

/**
 * Generic chart engine that renders charts based on configuration
 * Used by both infrastructure and environment categories
 */
const ChartEngine = ({ charts = [], heightHint = 400 }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // ResizeObserver to handle container sizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial size check with timeout to ensure DOM is ready
    setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }, 0);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Memoized chart options
  const chartConfigs = useMemo(() => {
    if (!Array.isArray(charts) || charts.length === 0) return [];

    return charts.map((chart, index) => {
      const { type, title, data, colors, ...rest } = chart;
      let options = {};

      switch (type) {
        case 'donut':
          options = donutOptions({
            title,
            seriesData: data || [],
            colors,
            centerText: rest.centerText
          });
          break;
        
        case 'bar':
          options = barOptions({
            title,
            xData: data?.labels || [],
            yData: data?.values || [],
            colors,
            horizontal: rest.horizontal || false
          });
          break;
        
        case 'stackedBar':
          options = stackedBarOptions({
            title,
            categories: data?.categories || [],
            series: data?.series || [],
            colors,
            groupKey: rest.groupKey
          });
          break;
        
        default:
          console.warn(`Unknown chart type: ${type}`);
          return null;
      }

      return {
        key: `${type}-${index}`,
        options,
        height: rest.height || heightHint
      };
    }).filter(Boolean);
  }, [charts, heightHint]);

  // Handle chart ready event
  const handleChartReady = (chartInstance) => {
    if (chartInstance && containerSize.width > 0) {
      // Small delay to ensure proper rendering
      setTimeout(() => {
        chartInstance.resize();
      }, 100);
    }
  };

  if (!Array.isArray(charts) || charts.length === 0) {
    return null;
  }

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {chartConfigs.map((config) => (
          <Grid 
            item 
            xs={12} 
            md={config.options.series?.[0]?.type === 'pie' ? 6 : 12}
            key={config.key}
          >
            <Box sx={{ width: '100%', height: config.height }}>
              {containerSize.width > 0 && (
                <ReactECharts
                  option={config.options}
                  style={{ width: '100%', height: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  onChartReady={handleChartReady}
                  notMerge={true}
                  lazyUpdate={true}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChartEngine;