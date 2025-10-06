import React from 'react';
import { Box, Typography, Chip, Stack, useTheme } from '@mui/material';
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
 * Simple Bar Chart wrapper component for distribution visualization (Ada vs Tidak Ada)
 * Follows DESAIN ACUAN styling and behavior
 */
const BarChartSimple = ({ 
  data = [], 
  title = "Distribusi Chart",
  xCategories = ["Tidak Ada", "Ada"],
  colors = ['#d946ef', '#a855f7'],
  showValueLabels = true
}) => {
  const theme = useTheme();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          backgroundColor: 'white',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 1.5,
          boxShadow: theme.shadows[2]
        }}>
          <Typography variant="body2" fontWeight="medium">
            {data.name}
          </Typography>
          <Typography variant="body2" color="primary">
            Jumlah: {data.value} desa
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Persentase: {data.percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!data.length) {
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
          Tidak ada data distribusi untuk ditampilkan
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
      
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider} 
            />
            <XAxis 
              dataKey="name"
              tick={{ 
                fontSize: 12, 
                fill: theme.palette.text.secondary 
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ 
                fontSize: 12, 
                fill: theme.palette.text.secondary 
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index] || colors[0]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Value labels below chart */}
      {showValueLabels && data.length > 0 && (
        <Stack 
          direction="row" 
          justifyContent="center" 
          spacing={3} 
          sx={{ mt: 2 }}
        >
          {data.map((item, index) => (
            <Chip
              key={item.name}
              label={`${item.name}: ${item.label}`}
              sx={{
                backgroundColor: colors[index] || colors[0],
                color: 'white',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BarChartSimple;