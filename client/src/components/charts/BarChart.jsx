import React, { useRef, useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';
import { CHART_COLORS, CHART_DEFAULTS, formatChartLabel, getResponsiveFontSizes } from './theme';

const BarChart = ({ 
  data = [], 
  title = "",
  orientation = 'vertical', // 'vertical' | 'horizontal'
  colors = CHART_COLORS.qualitative,
  colorMode = 'single', // 'single' | 'gradient' | 'ranking'
  dataKey = 'value',
  nameKey = 'name',
  showGrid = true,
  showTooltip = true,
  unit = "desa",
  onResize,
  width,
  height,
  key,
  emptyMessage = "Data tidak tersedia",
  maxBars = null
}) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });

  // Debug logging
  console.log('BarChart render:', {
    title,
    dataLength: data?.length,
    width,
    height,
    key,
    hasData: data && data.length > 0
  });

  // Handle resize
  useEffect(() => {
    if (onResize && containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });
      onResize({ width: offsetWidth, height: offsetHeight });
    }
  }, [onResize]);

  if (!data || data.length === 0) {
    return (
      <Box 
        ref={containerRef}
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100%"
        minHeight={240}
        sx={{ 
          backgroundColor: '#f8fafc', 
          borderRadius: 2,
          border: '2px dashed #cbd5e1'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  // Get responsive font sizes and settings
  const fontSizes = getResponsiveFontSizes(containerSize.width);
  const displayData = maxBars ? data.slice(0, maxBars) : data;

  const getBarColor = (index, value) => {
    switch (colorMode) {
      case 'gradient':
        const gradientColors = [
          CHART_COLORS.qualitative[0],
          CHART_COLORS.qualitative[1], 
          CHART_COLORS.qualitative[2],
          CHART_COLORS.qualitative[3],
          CHART_COLORS.qualitative[4]
        ];
        return gradientColors[index % gradientColors.length];
      case 'ranking':
        const rankingColors = [
          '#10b981', // Best - Green
          '#22c55e', // Good - Light Green
          '#3b82f6', // Medium - Blue
          '#f59e0b', // Fair - Amber
          '#ef4444', // Poor - Red
          '#ef4444'  // Worst - Red
        ];
        return rankingColors[index % rankingColors.length];
      default:
        return colors[index % colors.length];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 1.5,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            minWidth: 120,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              fontSize: fontSizes.value,
              mb: 0.5 
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontSize: fontSizes.label }}
          >
            {formatChartLabel(data.value, unit)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Calculate responsive margins
  const responsiveMargin = {
    top: 20,
    right: 20,
    left: Math.max(60, Math.min(100, containerSize.width * 0.2)),
    bottom: orientation === 'vertical' ? Math.max(40, fontSizes.axis * 4) : 20
  };

  if (orientation === 'horizontal') {
    return (
      <Box 
        ref={containerRef}
        sx={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 240,
        }}
      >
        {title && (
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom
            sx={{
              fontSize: fontSizes.title,
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
            }}
          >
            {title}
          </Typography>
        )}
        
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer key={`vertical-${key || 'default'}`} width="100%" height="100%">
            <RechartsBarChart
              layout="horizontal"
              data={displayData}
              margin={responsiveMargin}
              barCategoryGap={CHART_DEFAULTS.bar.categoryGap}
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb"
                  opacity={0.7}
                />
              )}
              <XAxis 
                type="number" 
                tick={{ fontSize: fontSizes.axis }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                type="category" 
                dataKey={nameKey}
                tick={{ fontSize: fontSizes.axis }}
                width={responsiveMargin.left - 10}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              <Bar 
                dataKey={dataKey}
                radius={[0, 4, 4, 0]}
                maxBarSize={CHART_DEFAULTS.bar.maxBarThickness}
                animationDuration={CHART_DEFAULTS.bar.animationDuration}
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(index, entry[dataKey])}
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }

  // Vertical bar chart
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 240,
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          align="center" 
          gutterBottom
          sx={{
            fontSize: fontSizes.title,
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer key={`horizontal-${key || 'default'}`} width="100%" height="100%">
          <RechartsBarChart
            data={displayData}
            margin={responsiveMargin}
            barCategoryGap={CHART_DEFAULTS.bar.categoryGap}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb"
                opacity={0.7}
              />
            )}
            <XAxis 
              dataKey={nameKey}
              angle={containerSize.width < 400 ? -45 : 0}
              textAnchor={containerSize.width < 400 ? "end" : "middle"}
              height={responsiveMargin.bottom}
              interval={0}
              tick={{ fontSize: fontSizes.axis }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: fontSizes.axis }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            <Bar 
              dataKey={dataKey}
              radius={CHART_DEFAULTS.bar.radius}
              maxBarSize={CHART_DEFAULTS.bar.maxBarThickness}
              animationDuration={CHART_DEFAULTS.bar.animationDuration}
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(index, entry[dataKey])}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default BarChart;