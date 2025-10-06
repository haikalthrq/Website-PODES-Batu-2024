import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Groups
} from '@mui/icons-material';
import RankingBarHorizontal from './RankingBarHorizontal';
import BinaryDistributionBar from './BinaryDistributionBar';
import MetricTile from './MetricTile';

const IndicatorDetailPanel = ({ 
  title, 
  dataset, 
  accessor, 
  indicatorName,
  loading = false,
  colorTokens = {
    primary: '#8b5cf6',
    secondary: '#10b981'
  }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));


  // Data computations with memoization
  const computedData = useMemo(() => {
    if (!dataset || !accessor || loading) {
      return {
        rankingData: [],
        distributionData: [],
        statistics: {
          tertinggi: 0,
          terendah: 0,
          total: 0,
          totalDesa: 0
        }
      };
    }

    try {
      // Process data for visualization
      
      // Extract values using accessor function or key
      const processedData = dataset.map(item => {
        let value = 0;
        
        if (typeof accessor === 'function') {
          value = accessor(item) || 0;
        } else if (typeof accessor === 'string') {
          value = item[accessor] || 0;
        } else if (typeof accessor === 'object' && accessor.key) {
          // Handle nested object access like { key: 'pendidikan.tk' }
          const keys = accessor.key.split('.');
          let current = item;
          for (const key of keys) {
            current = current?.[key];
            if (current === undefined || current === null) break;
          }
          value = current || 0;
        }
        
        return {
          desa: item.nama_desa || item.desa || 'Unknown',
          kecamatan: item.nama_kecamatan || item.kecamatan || 'Unknown',
          value: Number(value) || 0
        };
      });

      // Sort by value descending for ranking
      const rankingData = [...processedData].sort((a, b) => b.value - a.value);
      
      // Data processing complete
      
      // Calculate statistics
      const values = processedData.map(item => item.value);
      const nonZeroValues = values.filter(v => v > 0);
      
      const statistics = {
        tertinggi: Math.max(...values),
        terendah: nonZeroValues.length > 0 ? Math.min(...nonZeroValues) : 0,
        total: values.reduce((sum, val) => sum + val, 0),
        totalDesa: processedData.length
      };

      return {
        rankingData,
        distributionData: processedData,
        statistics
      };
    } catch (error) {
      console.warn('Error computing indicator data:', error);
      return {
        rankingData: [],
        distributionData: [],
        statistics: {
          tertinggi: 0,
          terendah: 0,
          total: 0,
          totalDesa: 0
        }
      };
    }
  }, [dataset, accessor, loading]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Loading state */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ width: '60%', height: 24, bgcolor: 'grey.200', borderRadius: 1, mb: 3 }} />
                <Box sx={{ width: '100%', height: 340, bgcolor: 'grey.100', borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ width: '60%', height: 24, bgcolor: 'grey.200', borderRadius: 1, mb: 3 }} />
                <Box sx={{ width: '100%', height: 340, bgcolor: 'grey.100', borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const { rankingData, distributionData, statistics } = computedData;

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1280px',
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Ranking Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card 
            elevation={0}
            sx={{ 
              border: '1px solid #e5e7eb',
              borderRadius: 3,
              bgcolor: 'background.paper',
              height: '100%',
              minHeight: 400
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <RankingBarHorizontal
                data={rankingData}
                loading={loading}
                title="Ranking Desa"
                indicatorName={indicatorName || title}
                color={colorTokens.primary}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Distribution Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card 
            elevation={0}
            sx={{ 
              border: '1px solid #e5e7eb',
              borderRadius: 3,
              bgcolor: 'background.paper',
              height: '100%',
              minHeight: 400
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <BinaryDistributionBar
                data={distributionData}
                loading={loading}
                title="Analisis Distribusi"
                indicatorName={indicatorName || title}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Row */}
      <Box sx={{ mb: 4 }}>
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
          📊 Statistik Kunci & Ringkasan Data
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <MetricTile
              icon="🔝"
              label="Tertinggi"
              value={statistics.tertinggi}
              color="#10b981"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <MetricTile
              icon="🔻"
              label="Terendah"
              value={statistics.terendah}
              color="#e91e63"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <MetricTile
              icon="📊"
              label="Total"
              value={statistics.total}
              color="#8b5cf6"
              loading={loading}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <MetricTile
              icon="🏘️"
              label="Total Desa"
              value={statistics.totalDesa}
              color="#f59e0b"
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>


    </Box>
  );
};

export default IndicatorDetailPanel;