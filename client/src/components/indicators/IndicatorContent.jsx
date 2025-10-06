import React from 'react';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';
import { PieChart, BarChart, DistributionChart, KeyStats } from '../charts';

const IndicatorContent = ({ 
  indicatorData,
  config,
  villageData = [],
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Memuat data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!indicatorData || !config) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Data tidak tersedia
        </Typography>
      </Box>
    );
  }

  const { 
    charts = [], 
    stats = {},
    layout = 'standard' // 'standard' | 'compact' | 'detailed'
  } = config;

  const renderChart = (chartConfig, index) => {
    const { type, data, title, ...chartProps } = chartConfig;

    switch (type) {
      case 'pie':
      case 'donut':
        return (
          <PieChart
            key={`chart-${index}`}
            data={data}
            title={title}
            innerRadius={type === 'donut' ? 60 : 0}
            {...chartProps}
          />
        );
      
      case 'bar':
        return (
          <BarChart
            key={`chart-${index}`}
            data={data}
            title={title}
            {...chartProps}
          />
        );
      
      case 'distribution':
        return (
          <DistributionChart
            key={`chart-${index}`}
            data={data}
            title={title}
            {...chartProps}
          />
        );
      
      default:
        return (
          <Box key={`chart-${index}`} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chart type "{type}" not supported
            </Typography>
          </Box>
        );
    }
  };

  // Standard layout: Stats + Charts in sections
  if (layout === 'standard') {
    return (
      <Box>
        {/* Key Statistics Section */}
        {stats && Object.keys(stats).length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📊 Statistik Kunci & Ringkasan Data
            </Typography>
            <KeyStats stats={stats} layout="horizontal" />
          </Box>
        )}

        {/* Charts Section */}
        {charts && charts.length > 0 && (
          <Box>
            <Grid container spacing={3}>
              {charts.map((chartConfig, index) => {
                const gridSize = chartConfig.gridSize || { xs: 12, md: 6 };
                return (
                  <Grid item {...gridSize} key={`grid-${index}`}>
                    <Paper 
                      elevation={2}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        height: '100%',
                        transition: 'elevation 0.3s ease',
                        '&:hover': {
                          elevation: 4
                        }
                      }}
                    >
                      {renderChart(chartConfig, index)}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>
    );
  }

  // Compact layout: Everything in a tighter grid
  if (layout === 'compact') {
    return (
      <Grid container spacing={2}>
        {/* Stats in sidebar */}
        {stats && Object.keys(stats).length > 0 && (
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ringkasan
              </Typography>
              <KeyStats stats={stats} layout="vertical" showIcons={false} />
            </Paper>
          </Grid>
        )}
        
        {/* Charts in main area */}
        <Grid item xs={12} md={stats && Object.keys(stats).length > 0 ? 8 : 12}>
          <Grid container spacing={2}>
            {charts.map((chartConfig, index) => (
              <Grid item xs={12} sm={6} key={`compact-${index}`}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, height: 280 }}>
                  {renderChart(chartConfig, index)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // Detailed layout: Full width sections with dividers
  if (layout === 'detailed') {
    return (
      <Box>
        {/* Stats Section */}
        {stats && Object.keys(stats).length > 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Statistik Kunci
              </Typography>
              <KeyStats stats={stats} layout="grid" />
            </Box>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Charts Sections */}
        {charts.map((chartConfig, index) => (
          <Box key={`detailed-${index}`} sx={{ mb: index < charts.length - 1 ? 4 : 0 }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                transition: 'elevation 0.3s ease',
                '&:hover': {
                  elevation: 4
                }
              }}
            >
              {renderChart(chartConfig, index)}
            </Paper>
            {index < charts.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Box>
        ))}
      </Box>
    );
  }

  // Fallback: Simple vertical layout
  return (
    <Box>
      {stats && Object.keys(stats).length > 0 && (
        <Box sx={{ mb: 3 }}>
          <KeyStats stats={stats} />
        </Box>
      )}
      
      {charts.map((chartConfig, index) => (
        <Box key={`fallback-${index}`} sx={{ mb: 3 }}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            {renderChart(chartConfig, index)}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default IndicatorContent;