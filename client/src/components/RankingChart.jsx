import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Skeleton
} from '@mui/material';
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

const RankingChart = ({ 
  data, 
  loading = false, 
  title = "Ranking Desa"
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        height: 350, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary'
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📊 Tidak ada data
        </Typography>
        <Typography variant="body2">
          Pilih kategori dan indikator untuk melihat ranking
        </Typography>
      </Box>
    );
  }

  // Format data for chart
  const chartData = data.slice(0, 8).map((item, index) => ({
    ...item,
    rank: index + 1,
    displayName: item.nama_desa.length > 12 ? 
      `${item.nama_desa.substring(0, 12)}...` : 
      item.nama_desa,
    fullName: `${item.nama_desa}, ${item.nama_kecamatan}`
  }));

  const CustomTooltip = ({ active, payload, label }) => {
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
            #{data.rank} {data.fullName}
          </Typography>
          <Typography variant="body2" color="primary.main">
            Nilai: {payload[0].value.toLocaleString('id-ID')}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="displayName"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis 
            tickFormatter={(value) => value.toLocaleString('id-ID')}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            fill="#3b82f6"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`rgba(59, 130, 246, ${0.8 - (index * 0.08)})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RankingChart;