import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from './useDeferredMeasure';
import { UnifiedLegend } from './UnifiedLegend';
import { AXIS } from '../theme/chartColors';

type VillageRow = { 
  nama_kecamatan: string; 
  nama_desa: string; 
  [key: string]: any 
};

export interface BTSPerKecamatanProps {
  title?: string;
  rows: VillageRow[];
  valueKey: string;
  height?: number;
  showInsight?: boolean;
}

/**
 * Simple BTS per Kecamatan bar chart focused on storytelling
 * Shows total BTS count per kecamatan with clear insights
 */
export const BTSPerKecamatan: React.FC<BTSPerKecamatanProps> = ({
  title,
  rows,
  valueKey,
  height = 300,
  showInsight = true
}) => {
  const { ref, ready, width } = useDeferredMeasure();

  // Calculate BTS totals per kecamatan
  const kecamatanData = React.useMemo(() => {
    if (!rows || !Array.isArray(rows)) {
      return [];
    }
    
    const totals: Record<string, number> = {};
    
    rows.forEach(row => {
      const kecamatan = row.nama_kecamatan;
      const btsCount = Number(row[valueKey] ?? 0);
      totals[kecamatan] = (totals[kecamatan] ?? 0) + btsCount;
    });

    // Sort by BTS count descending to show ranking
    const sorted = Object.entries(totals)
      .sort(([,a], [,b]) => b - a)
      .map(([kecamatan, total]) => ({ kecamatan, total }));

    return sorted;
  }, [rows, valueKey]);

  // Generate insight text
  const insight = React.useMemo(() => {
    if (kecamatanData.length === 0) return "";
    
    const highest = kecamatanData[0];
    const lowest = kecamatanData[kecamatanData.length - 1];
    
    if (highest.total === lowest.total) {
      return `Setiap kecamatan memiliki ${highest.total} BTS`;
    }
    
    return `Kec. ${highest.kecamatan} terbanyak (${highest.total} BTS), Kec. ${lowest.kecamatan} tersedikit (${lowest.total} BTS)`;
  }, [kecamatanData]);

  const categories = kecamatanData.map(item => item.kecamatan);
  const values = kecamatanData.map(item => item.total);
  const totalBTS = values.reduce((sum, val) => sum + val, 0);

  // Colors: highest gets darkest green, others lighter
  const colors = kecamatanData.map((_, index) => {
    const intensity = 1 - (index / Math.max(kecamatanData.length - 1, 1)) * 0.4;
    return `rgba(34, 197, 94, ${intensity})`; // green with varying opacity
  });

  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        distributed: true, // Use different colors
        dataLabels: {
          position: 'top' as const
        }
      }
    },
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val} BTS`,
      style: {
        fontSize: '12px',
        fontWeight: '600',
        colors: ['#374151']
      },
      offsetY: -8
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Kecamatan',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          color: AXIS.label
        }
      },
      labels: {
        style: {
          colors: AXIS.tick,
          fontSize: '11px',
          fontWeight: '500'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Total BTS',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          color: AXIS.label
        }
      },
      labels: {
        style: {
          colors: AXIS.tick,
          fontSize: '11px'
        },
        formatter: (val: number) => Math.floor(val).toString()
      },
      min: 0
    },
    grid: {
      show: true,
      borderColor: AXIS.grid,
      strokeDashArray: 3,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value: number, { dataPointIndex }: any) => {
          const kecamatan = categories[dataPointIndex];
          const percentage = totalBTS > 0 ? ((value / totalBTS) * 100).toFixed(1) : '0';
          return `${value} BTS (${percentage}% dari total)`;
        }
      }
    },
    legend: {
      show: false
    }
  };

  const series = [{
    name: 'Total BTS',
    data: values
  }];

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
      {/* Title with insight */}
      <Box sx={{ mb: 2 }}>
        {title && (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
        )}
        
        {showInsight && insight && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontStyle: 'italic'
            }}
          >
            {insight}
          </Typography>
        )}
      </Box>

      {/* Chart container */}
      <Box
        sx={{
          width: '100%',
          height: height - 80, // Reserve space for title and insight
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!ready ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 1 }}
          />
        ) : totalBTS === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 4
            }}
          >
            <Typography variant="body2">
              Tidak ada data BTS
            </Typography>
          </Box>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </Box>
  );
};

export default BTSPerKecamatan;