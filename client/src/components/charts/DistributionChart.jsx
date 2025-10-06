import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

// Color schemes for distribution charts
const DISTRIBUTION_COLORS = {
  kecamatan: ['#4CAF50', '#2196F3', '#FF9800'],
  category: ['#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722'],
  heatmap: ['#E8F5E8', '#A5D6A7', '#66BB6A', '#4CAF50', '#388E3C', '#2E7D32']
};

const DistributionChart = ({ 
  data = [], 
  title = "",
  groupBy = 'kecamatan', // 'kecamatan' | 'category'
  stackedKeys = [], // For stacked bar charts
  height = 350,
  showLegend = true,
  emptyMessage = "Data tidak tersedia",
  colorScheme = 'kecamatan'
}) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height={height}
        sx={{ 
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          border: '2px dashed #ccc'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  const colors = DISTRIBUTION_COLORS[colorScheme] || DISTRIBUTION_COLORS.kecamatan;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 2,
            border: '1px solid #ccc',
            borderRadius: 1,
            boxShadow: 2,
            minWidth: 150
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={`tooltip-${index}`}
              variant="body2" 
              sx={{ 
                color: entry.color,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{entry.dataKey}:</span>
              <span style={{ fontWeight: 'bold', marginLeft: 8 }}>
                {entry.value}
              </span>
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // For stacked bar charts
  if (stackedKeys && stackedKeys.length > 0) {
    return (
      <Box sx={{ width: '100%', height: height }}>
        {title && (
          <Typography variant="h6" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {stackedKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                stackId="distribution"
                fill={colors[index % colors.length]}
                radius={index === stackedKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                animationDuration={800}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  // Regular bar chart
  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DistributionChart;