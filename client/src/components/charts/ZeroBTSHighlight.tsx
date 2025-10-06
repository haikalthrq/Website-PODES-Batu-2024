import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from './useDeferredMeasure';

type VillageRow = { 
  nama_kecamatan: string; 
  nama_desa: string; 
  [key: string]: any 
};

export interface ZeroBTSHighlightProps {
  title?: string;
  rows: VillageRow[];
  valueKey: string;
  height?: number;
  showAsDonut?: boolean;
}

/**
 * Highlight component for villages without BTS
 * Simple visualization to show the gap in BTS coverage
 */
export const ZeroBTSHighlight: React.FC<ZeroBTSHighlightProps> = ({
  title = "Desa Tanpa BTS",
  rows,
  valueKey,
  height = 280,
  showAsDonut = true
}) => {
  const { ref, ready, width } = useDeferredMeasure();

  // Calculate villages with and without BTS
  const coverage = React.useMemo(() => {
    if (!rows || !Array.isArray(rows)) {
      return { withBTS: 0, withoutBTS: 0, total: 0, percentage: 0 };
    }

    let withBTS = 0;
    let withoutBTS = 0;

    rows.forEach(row => {
      const btsCount = Number(row[valueKey] ?? 0);
      if (btsCount > 0) {
        withBTS++;
      } else {
        withoutBTS++;
      }
    });

    const total = withBTS + withoutBTS;
    const withoutBTSPercentage = total > 0 ? (withoutBTS / total) * 100 : 0;
    const withBTSPercentage = total > 0 ? (withBTS / total) * 100 : 0;

    return {
      withBTS,
      withoutBTS,
      total,
      withoutBTSPercentage,
      withBTSPercentage
    };
  }, [rows, valueKey]);

  // Color scheme: red for without BTS (alert), green for with BTS
  const colors = ['#ef4444', '#22c55e']; // red, green
  const data = [coverage.withoutBTS, coverage.withBTS];
  const labels = ['Tanpa BTS', 'Ada BTS'];

  const chartOptions = {
    chart: {
      type: showAsDonut ? 'donut' as const : 'bar' as const,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: showAsDonut ? {
      pie: {
        donut: {
          size: '65%',
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
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ef4444', // Red for emphasis
              formatter: (val: string) => `${val} desa`
            },
            total: {
              show: true,
              label: coverage.withoutBTS > 0 ? 'Tanpa BTS' : 'Semua Ada BTS',
              fontSize: '12px',
              color: '#6b7280',
              formatter: () => `${coverage.withoutBTS} desa`
            }
          }
        }
      }
    } : {
      bar: {
        horizontal: true,
        distributed: true
      }
    },
    colors: colors,
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        if (showAsDonut) {
          return `${val.toFixed(1)}%`;
        } else {
          const value = data[opts.seriesIndex];
          return `${value} desa`;
        }
      },
      style: {
        fontSize: '11px',
        fontWeight: '600',
        colors: showAsDonut ? ['#fff'] : ['#374151']
      }
    },
    legend: {
      show: true,
      position: 'bottom' as const,
      fontSize: '12px',
      markers: {
        radius: 12
      },
      labels: {
        colors: '#374151'
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          const percentage = coverage.total > 0 
            ? ((value / coverage.total) * 100).toFixed(1)
            : '0';
          return `${value} desa (${percentage}%)`;
        }
      }
    }
  };

  const series = showAsDonut ? data : [{
    name: 'Jumlah Desa',
    data: data
  }];

  // Generate alert message
  const alertMessage = React.useMemo(() => {
    if (coverage.withoutBTS === 0) {
      return "✅ Semua desa sudah memiliki BTS";
    } else if (coverage.withoutBTSPercentage > 50) {
      return `⚠️ Lebih dari separuh desa (${coverage.withoutBTS} dari ${coverage.total}) belum memiliki BTS`;
    } else if (coverage.withoutBTS > 5) {
      return `⚠️ Masih ada ${coverage.withoutBTS} desa yang belum memiliki BTS`;
    } else {
      return `ℹ️ Tinggal ${coverage.withoutBTS} desa yang belum memiliki BTS`;
    }
  }, [coverage]);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Title */}
      {title && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      )}

      {/* Alert Message */}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 1,
          backgroundColor: coverage.withoutBTS > 0 ? '#fef3c7' : '#d1fae5', // amber or green
          border: `1px solid ${coverage.withoutBTS > 0 ? '#f59e0b' : '#22c55e'}`
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: coverage.withoutBTS > 0 ? '#92400e' : '#065f46',
            fontSize: '0.75rem',
            fontWeight: '500',
            display: 'block',
            textAlign: 'center'
          }}
        >
          {alertMessage}
        </Typography>
      </Box>

      {/* Chart container */}
      <Box
        sx={{
          width: '100%',
          height: height - 120, // Reserve space for title and alert
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!ready ? (
          <Skeleton
            variant={showAsDonut ? "circular" : "rectangular"}
            width={showAsDonut ? Math.min(width * 0.7, 160) : "100%"}
            height={showAsDonut ? Math.min(width * 0.7, 160) : "100%"}
          />
        ) : coverage.total === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 4
            }}
          >
            <Typography variant="body2">
              Tidak ada data desa
            </Typography>
          </Box>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type={showAsDonut ? "donut" : "bar"}
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </Box>
  );
};

export default ZeroBTSHighlight;