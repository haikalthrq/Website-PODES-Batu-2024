import React, { useRef, useEffect, useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Box, Typography } from '@mui/material';
import { CHART_COLORS, CHART_DEFAULTS, formatChartLabel, getResponsiveFontSizes } from './theme';

const PieChart = ({ 
  data = [], 
  title = "", 
  showLegend = true, 
  innerRadius = CHART_DEFAULTS.pie.innerRadius,
  outerRadius = CHART_DEFAULTS.pie.outerRadius,
  showLabels = true,
  colors = CHART_COLORS.qualitative,
  unit = "desa",
  onResize,
  width,
  height,
  key,
  emptyMessage = "Data tidak tersedia"
}) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });

  // Debug logging
  console.log('PieChart render:', {
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

  // Get responsive font sizes
  const fontSizes = getResponsiveFontSizes(containerSize.width);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatLabel = (entry) => {
    if (!showLabels) return '';
    const percentage = (entry.value / total) * 100;
    const rounded = Math.round(percentage * 100) / 100;
    const formatted = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
    return containerSize.width > 300 ? `${entry.name}\n${formatted}%` : `${formatted}%`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (data.value / total) * 100;
      const rounded = Math.round(percentage * 100) / 100;
      const formatted = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
      
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 1.5,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            minWidth: 140,
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
            {data.payload.name}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontSize: fontSizes.label }}
          >
            {formatChartLabel(data.value, unit)}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: fontSizes.label,
              color: 'text.secondary' 
            }}
          >
            {formatted}% dari total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Calculate responsive radii
  const maxRadius = Math.min(containerSize.width, containerSize.height) * 0.35;
  const responsiveOuterRadius = Math.min(outerRadius, maxRadius);
  const responsiveInnerRadius = innerRadius * (responsiveOuterRadius / outerRadius);

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
        <ResponsiveContainer key={key || 'default'} width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={formatLabel}
              outerRadius={responsiveOuterRadius}
              innerRadius={responsiveInnerRadius}
              paddingAngle={CHART_DEFAULTS.pie.paddingAngle}
              cornerRadius={CHART_DEFAULTS.pie.cornerRadius}
              dataKey="value"
              animationBegin={CHART_DEFAULTS.pie.animationBegin}
              animationDuration={CHART_DEFAULTS.pie.animationDuration}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: '16px',
                  fontSize: `${fontSizes.legend}px`,
                  lineHeight: 1.2,
                }}
                iconType="circle"
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PieChart;