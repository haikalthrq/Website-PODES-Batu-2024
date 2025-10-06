import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Skeleton,
  Stack,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const DistributionChart = ({ 
  data, 
  loading = false, 
  title = "Distribusi Data"
}) => {
  const theme = useTheme();

  // Modern color palette
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', mb: 2 }} />
        <Stack spacing={1}>
          {[1,2,3].map(i => (
            <Skeleton key={i} variant="rectangular" width="100%" height={24} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        height: 300, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary'
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          🍩 Tidak ada data
        </Typography>
        <Typography variant="body2">
          Pilih kategori dan indikator untuk melihat distribusi
        </Typography>
      </Box>
    );
  }

  // Format data for pie chart
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            p: 1.5,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {data.label}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {data.count} desa ({data.percentage.toFixed(1)}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box>
      {/* Chart */}
      <Box sx={{ height: 250, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="count"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Stack spacing={1}>
        {chartData.map((item, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 1,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%',
                  bgcolor: COLORS[index % COLORS.length]
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
            <Chip 
              label={`${item.count} (${item.percentage.toFixed(1)}%)`}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: COLORS[index % COLORS.length],
                color: COLORS[index % COLORS.length]
              }}
            />
          </Box>
        ))}
      </Stack>

      {/* Summary */}
      <Box sx={{ 
        mt: 2, 
        p: 1.5, 
        bgcolor: 'rgba(59, 130, 246, 0.08)', 
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Total: {totalCount} desa/kelurahan
        </Typography>
      </Box>
    </Box>
  );
};

export default DistributionChart;