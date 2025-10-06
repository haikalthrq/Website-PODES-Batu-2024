import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * Horizontal Bar Chart wrapper component for ranking visualization
 * Follows DESAIN ACUAN styling and behavior
 */
const BarChartHorizontal = ({ 
  data = [], 
  title = "Ranking Chart",
  xLabel = "Nilai",
  yLabel = "Desa",
  barColor = '#14b8a6',
  maxItems = 12
}) => {
  const theme = useTheme();

  // Limit data to prevent overcrowding
  const chartData = data.slice(0, maxItems);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          backgroundColor: 'white',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 1.5,
          boxShadow: theme.shadows[2],
          maxWidth: 250
        }}>
          <Typography variant="body2" fontWeight="medium">
            {data.nama_desa}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.nama_kecamatan}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
            {xLabel}: {data.value}
          </Typography>
          <Typography variant="caption">
            Peringkat: #{data.rank}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: theme.palette.grey[50],
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        height: 350,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          Tidak ada data untuk ditampilkan
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}
      
      <Box sx={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider} 
            />
            <XAxis 
              type="number" 
              tick={{ 
                fontSize: 12, 
                fill: theme.palette.text.secondary 
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              type="category" 
              dataKey="displayName"
              tick={{ 
                fontSize: 11, 
                fill: theme.palette.text.secondary 
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={barColor} 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default BarChartHorizontal;