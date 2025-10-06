import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * GroupedBarsComparisonChart - Responsive grouped bar chart for village comparison
 * Implements proper responsive design with legend, tooltips, and rotated labels
 */
const GroupedBarsComparisonChart = ({
  data,
  categories,
  series,
  title = 'Perbandingan Indikator Kuantitatif',
  height = 480
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Transform data for Recharts grouped bar format
  const chartData = categories.map((category, index) => {
    const dataPoint = { name: category };
    
    series.forEach(serie => {
      dataPoint[serie.name] = serie.data[index] || 0;
    });
    
    return dataPoint;
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: entry.color
                }}
              />
              <Typography variant="body2">
                {entry.dataKey}: <strong>{entry.value.toLocaleString()}</strong>
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        mt: 2,
        px: 2
      }}
    >
      {payload.map((entry, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 1,
              backgroundColor: entry.color
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  if (!chartData.length) {
    return (
      <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Tidak ada data untuk ditampilkan
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: 'center',
            color: '#1e293b'
          }}
        >
          📊 {title}
        </Typography>

        <Box sx={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: isMobile ? 80 : 60
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="name"
                angle={isMobile ? -45 : -30}
                textAnchor="end"
                height={isMobile ? 80 : 60}
                interval={0}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  fill: '#6b7280'
                }}
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fill: '#6b7280'
                }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend />}
                wrapContent={true}
              />
              
              {/* Render bars for each indicator */}
              {series.map((serie, index) => (
                <Bar
                  key={serie.name}
                  dataKey={serie.name}
                  fill={serie.color}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={60}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Chart info */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="caption" color="text.secondary">
            📈 Grafik batang berkelompok menunjukkan perbandingan nilai indikator antar desa
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total: {categories.length} desa, {series.length} indikator
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GroupedBarsComparisonChart;