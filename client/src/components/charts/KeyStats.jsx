import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { 
  TrendingUp, 
  Assessment, 
  LocationOn, 
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Analytics
} from '@mui/icons-material';
import { StatCard } from '../common/ChartCard';

const KeyStats = ({ 
  stats = {},
  layout = 'grid', // 'grid' | 'horizontal' | 'vertical'
  showIcons = true,
  cardVariant = 'elevation', // 'elevation' | 'outlined'
  spacing = 2
}) => {
  // Default stats structure
  const defaultStats = {
    dominantCategory: { label: 'Kategori Dominan', value: '-', icon: <TrendingUp /> },
    percentage: { label: 'Persentase Dominan', value: '-', icon: <PieChartIcon /> },
    totalCategories: { label: 'Total Kategori', value: '-', icon: <BarChartIcon /> },
    totalDesa: { label: 'Total Desa', value: '-', icon: <LocationOn /> },
    totalData: { label: 'Total Data', value: '-', icon: <Assessment /> },
    average: { label: 'Rata-rata', value: '-', icon: <Analytics /> }
  };

  const combinedStats = { ...defaultStats, ...stats };
  const statEntries = Object.entries(combinedStats).filter(([key, value]) => value.value !== null && value.value !== undefined);

  if (statEntries.length === 0) {
    return (
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Statistik tidak tersedia
        </Typography>
      </Box>
    );
  }

  const formatValue = (value, key) => {
    if (typeof value === 'number') {
      if (key === 'percentage') {
        return `${value.toFixed(1)}%`;
      }
      if (key === 'average') {
        return value.toFixed(2);
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getCardColor = (key, index) => {
    const colors = {
      dominantCategory: '#4CAF50',
      percentage: '#2196F3', 
      totalCategories: '#FF9800',
      totalDesa: '#9C27B0',
      totalData: '#607D8B',
      average: '#00BCD4'
    };
    return colors[key] || '#757575';
  };

  if (layout === 'horizontal') {
    return (
      <Box sx={{ display: 'flex', gap: spacing, flexWrap: 'wrap', justifyContent: 'center' }}>
        {statEntries.map(([key, stat], index) => (
          <Card 
            key={key}
            variant={cardVariant}
            sx={{ 
              minWidth: 120,
              borderLeft: `4px solid ${getCardColor(key, index)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ padding: '12px !important' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {showIcons && (
                  <Box sx={{ color: getCardColor(key, index) }}>
                    {stat.icon}
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {formatValue(stat.value, key)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (layout === 'vertical') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
        {statEntries.map(([key, stat], index) => (
          <Card 
            key={key}
            variant={cardVariant}
            sx={{ 
              borderLeft: `4px solid ${getCardColor(key, index)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ padding: '16px !important' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  {showIcons && (
                    <Box sx={{ color: getCardColor(key, index) }}>
                      {stat.icon}
                    </Box>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatValue(stat.value, key)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Grid layout (default)
  return (
    <Grid container spacing={spacing}>
      {statEntries.map(([key, stat], index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
          <Card 
            variant={cardVariant}
            sx={{ 
              height: '100%',
              borderTop: `4px solid ${getCardColor(key, index)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', padding: '16px !important' }}>
              {showIcons && (
                <Box 
                  sx={{ 
                    color: getCardColor(key, index),
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: getCardColor(key, index) }}>
                {formatValue(stat.value, key)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KeyStats;