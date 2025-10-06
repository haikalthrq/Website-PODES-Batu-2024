import React from 'react';
import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from '../hooks/useDeferredMeasure';

interface ZeroBTSHighlightProps {
  rows: any[];
  valueKey: string;
  height?: number;
  showAsDonut?: boolean;
}

const ZeroBTSHighlight: React.FC<ZeroBTSHighlightProps> = ({
  rows,
  valueKey,
  height = 300,
  showAsDonut = true
}) => {
  const { ref, ready, width } = useDeferredMeasure();

  // Calculate comprehensive BTS statistics
  const stats = React.useMemo(() => {
    if (!rows || !Array.isArray(rows)) {
      return { 
        withBTS: 0, 
        withoutBTS: 0, 
        total: 0, 
        totalBTS: 0,
        avgBTS: 0,
        withoutBTSPercentage: 0,
        withBTSPercentage: 0
      };
    }

    let withBTS = 0;
    let withoutBTS = 0;
    let totalBTS = 0;

    rows.forEach(row => {
      const btsCount = Number(row[valueKey] ?? 0);
      totalBTS += btsCount;
      if (btsCount > 0) {
        withBTS++;
      } else {
        withoutBTS++;
      }
    });

    const total = withBTS + withoutBTS;
    const withoutBTSPercentage = total > 0 ? (withoutBTS / total) * 100 : 0;
    const withBTSPercentage = total > 0 ? (withBTS / total) * 100 : 0;
    const avgBTS = total > 0 ? totalBTS / total : 0;

    return {
      withBTS,
      withoutBTS,
      total,
      totalBTS,
      avgBTS,
      withoutBTSPercentage,
      withBTSPercentage
    };
  }, [rows, valueKey]);

  // Chart configuration for donut
  const chartOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 'bold',
              color: stats.withoutBTS > 0 ? '#ef4444' : '#22c55e',
              formatter: (val: string) => `${val} desa`
            },
            total: {
              show: true,
              label: stats.withoutBTS > 0 ? 'Tanpa BTS' : 'Semua Terjangkau',
              fontSize: '12px',
              color: '#6b7280',
              formatter: () => `${stats.withoutBTS} desa`
            }
          }
        }
      }
    },
    colors: ['#ef4444', '#22c55e'], // Red for no BTS, Green for has BTS
    labels: ['Tanpa BTS', 'Ada BTS'],
    legend: {
      show: true,
      position: 'bottom' as const,
      fontSize: '14px',
      fontWeight: '500',
      markers: {
        width: 12,
        height: 12
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} desa`
      }
    }
  };

  const chartSeries = [stats.withoutBTS, stats.withBTS];

  return (
    <Box 
      ref={ref}
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {ready && width > 0 && (
        <>
          {/* Key Statistics Cards */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2
          }}>
            <Card sx={{ 
              backgroundColor: stats.withoutBTS > 0 ? '#fff3e0' : '#e8f5e8',
              border: stats.withoutBTS > 0 ? '2px solid #ff9800' : '2px solid #4caf50',
              boxShadow: 2
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold',
                  color: stats.withoutBTS > 0 ? '#f57c00' : '#2e7d32',
                  mb: 1
                }}>
                  {stats.withoutBTS}
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Desa Tanpa BTS
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: stats.withoutBTS > 0 ? '#f57c00' : '#2e7d32',
                  fontWeight: 500,
                  mt: 0.5
                }}>
                  ({stats.withoutBTSPercentage.toFixed(1)}%)
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              backgroundColor: '#f3e5f5', 
              border: '2px solid #9c27b0',
              boxShadow: 2
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold',
                  color: '#7b1fa2',
                  mb: 1
                }}>
                  {stats.totalBTS}
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Total BTS
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#7b1fa2',
                  fontWeight: 500,
                  mt: 0.5
                }}>
                  di {stats.total} desa
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              backgroundColor: '#e3f2fd', 
              border: '2px solid #2196f3',
              boxShadow: 2
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold',
                  color: '#1976d2',
                  mb: 1
                }}>
                  {stats.avgBTS.toFixed(1)}
                </Typography>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Rata-rata BTS
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#1976d2',
                  fontWeight: 500,
                  mt: 0.5
                }}>
                  per desa
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Status Alert */}
          {stats.withoutBTS > 0 ? (
            <Alert 
              severity="warning" 
              sx={{ 
                fontSize: '1rem',
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                🚨 <strong>Perhatian:</strong> Masih ada {stats.withoutBTS} desa ({stats.withoutBTSPercentage.toFixed(1)}%) yang memerlukan pemasangan tower BTS untuk meningkatkan konektivitas komunikasi
              </Typography>
            </Alert>
          ) : (
            <Alert 
              severity="success" 
              sx={{ fontSize: '1rem' }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                ✅ <strong>Excellent!</strong> Seluruh {stats.total} desa sudah memiliki akses tower BTS dengan rata-rata {stats.avgBTS.toFixed(1)} BTS per desa
              </Typography>
            </Alert>
          )}

          {/* Compact Donut Chart - Only if there's meaningful data to show */}
          {showAsDonut && stats.total > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 1
            }}>
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                width={Math.min(width * 0.5, 280)}
                height={220}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ZeroBTSHighlight;