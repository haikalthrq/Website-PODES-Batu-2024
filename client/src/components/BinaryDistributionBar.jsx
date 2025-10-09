import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { ChartDownloadButton } from './charts/ChartDownloadButton';

const BinaryDistributionBar = ({ 
  data, 
  loading = false, 
  title = "Analisis Distribusi",
  indicatorName = "Indikator"
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef(null);

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: 380 }}>
        <Box sx={{ 
          width: '60%', 
          height: 20, 
          bgcolor: 'grey.200', 
          borderRadius: 1,
          mb: 3
        }} />
        <Box sx={{ 
          width: '100%', 
          height: 340, 
          bgcolor: 'grey.100', 
          borderRadius: 2
        }} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        height: 380, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary',
        bgcolor: 'grey.50',
        borderRadius: 2
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📈 Tidak ada data
        </Typography>
        <Typography variant="body2">
          Data tidak tersedia untuk indikator ini
        </Typography>
      </Box>
    );
  }

  // Process data for binary distribution (Ada vs Tidak Ada)
  const distributionData = [
    {
      category: 'Tidak Ada',
      value: data.filter(item => (item.value || 0) === 0).length,
      label: `${data.filter(item => (item.value || 0) === 0).length} desa`,
      color: '#e91e63'
    },
    {
      category: 'Ada',
      value: data.filter(item => (item.value || 0) > 0).length,
      label: `${data.filter(item => (item.value || 0) > 0).length} desa`,
      color: '#10b981'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 2,
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          boxShadow: theme.shadows[4]
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {data.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.value} desa ({((data.value / 24) * 100).toFixed(1)}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom label component to show count above bars
  const CustomLabel = (props) => {
    const { x, y, width, value, payload } = props;
    
    // Safety check for payload and label
    if (!payload || !payload.label) {
      return null;
    }
    
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill={theme.palette.text.primary}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
      >
        {payload.label}
      </text>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Download Button */}
      {data && data.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <ChartDownloadButton
            chartRef={chartContainerRef}
            filename={`analisis-distribusi-${indicatorName.toLowerCase().replace(/\s+/g, '-')}`}
            size="small"
          />
        </Box>
      )}
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        📈 {title}
      </Typography>
      
      <Box 
        ref={chartContainerRef}
        sx={{ width: '100%', height: 280, mb: 2 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={distributionData}
            margin={{
              top: 40,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              domain={[0, 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              maxBarSize={120}
            >
              <LabelList content={<CustomLabel />} />
              {distributionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Summary chips */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {distributionData.map((item, index) => (
          <Chip
            key={index}
            label={item.label}
            sx={{
              bgcolor: item.color,
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BinaryDistributionBar;