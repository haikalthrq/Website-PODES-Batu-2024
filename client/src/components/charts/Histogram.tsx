import React, { useRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from './useDeferredMeasure';
import { UnifiedLegend } from './UnifiedLegend';
import { histogramCounts } from '../../utils/infra/distribution';
import { getBinColor, AXIS } from '../theme/chartColors';
import { ChartDownloadButton } from './ChartDownloadButton';

type VillageRow = { 
  nama_kecamatan: string; 
  nama_desa: string; 
  [key: string]: any 
};

export interface HistogramProps {
  title?: string;
  rows: VillageRow[];
  valueKey: string;
  bins?: number[];
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

/**
 * Histogram component specifically designed for BTS data
 * Shows clear binning with "Jumlah BTS per Desa" on X-axis and "Jumlah Desa" on Y-axis
 */
export const Histogram: React.FC<HistogramProps> = ({
  title,
  rows,
  valueKey,
  bins = [0, 1, 2, 3, 4, 5],
  height = 350,
  xAxisLabel = "Jumlah BTS per Desa",
  yAxisLabel = "Jumlah Desa"
}) => {
  const { ref, ready, width } = useDeferredMeasure();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Calculate histogram data
  const histData = histogramCounts(rows, valueKey, bins);
  const categories = histData.map(item => item.bucket);
  const values = histData.map(item => item.count);
  const colors = histData.map((_, index) => getBinColor(index));

  // Total for legend
  const totalDesa = values.reduce((sum, val) => sum + val, 0);

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        distributed: false, // Use single color for consistency
        dataLabels: {
          position: 'top' as const
        }
      }
    },
    colors: [getBinColor(2)], // Use consistent green color
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      style: {
        fontSize: '11px',
        fontWeight: '600',
        colors: ['#374151']
      },
      offsetY: -5
    },
    xaxis: {
      categories: categories,
      title: {
        text: xAxisLabel,
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
        }
      },
      axisBorder: {
        show: true,
        color: AXIS.grid
      },
      axisTicks: {
        show: true,
        color: AXIS.grid
      }
    },
    yaxis: {
      title: {
        text: yAxisLabel,
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
      min: 0,
      forceNiceScale: true
    },
    grid: {
      show: true,
      borderColor: AXIS.grid,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
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
          const bucket = categories[dataPointIndex];
          const bucketLabel = bucket.includes('+') 
            ? `${bucket.replace('+', '')} atau lebih BTS`
            : `${bucket} BTS`;
          return `${value} desa dengan ${bucketLabel}`;
        }
      }
    },
    legend: {
      show: false // We use custom legend
    }
  };

  const series = [{
    name: yAxisLabel,
    data: values
  }];

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Download Button */}
      {ready && totalDesa > 0 && (
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
            filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'histogram'}
            size="small"
          />
        </Box>
      )}

      {/* Title */}
      {title && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      )}

      {/* Chart container */}
      <Box
        ref={chartContainerRef}
        sx={{
          width: '100%',
          height: height - (title ? 80 : 60), // Reserve space for legend
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!ready ? (
          // Skeleton while measuring
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 1 }}
          />
        ) : totalDesa === 0 ? (
          // No data state
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 4
            }}
          >
            <Typography variant="body2">
              Tidak ada data BTS untuk ditampilkan
            </Typography>
          </Box>
        ) : (
          // Actual chart
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            width="100%"
            height="100%"
          />
        )}
      </Box>

      {/* Legend */}
      {ready && totalDesa > 0 && (
        <Box sx={{ mt: 1 }}>
          <UnifiedLegend
            items={[{
              label: `${yAxisLabel} (Total: ${totalDesa})`,
              color: getBinColor(2)
            }]}
            orientation="horizontal"
          />
          
          {/* Additional info */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              mt: 0.5,
              fontSize: '0.7rem'
            }}
          >
            Distribusi jumlah Base Transceiver Station (BTS) per desa di Kota Batu
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Histogram;