import React, { useRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from './useDeferredMeasure';
import { UnifiedLegend, LegendItem } from './UnifiedLegend';
import { perKecamatanByCategory, perKecamatanByBins } from '../../utils/infra/distribution';
import { getCategoryColor, getBinColor, AXIS } from '../theme/chartColors';
import { ChartDownloadButton } from './ChartDownloadButton';

type VillageRow = { 
  nama_kecamatan: string; 
  nama_desa: string; 
  [key: string]: any 
};

export interface BarGroupedStackedProps {
  title?: string;
  mode: 'qualitative' | 'numeric-bins';
  rows: VillageRow[];
  valueKey: string;
  categories?: string[];
  bins?: number[];
  displayLabels?: Record<string, string>; // Map original labels to shorter display labels
  height?: number;
  yAxisLabel?: string;
}

/**
 * Universal component for per-kecamatan distribution charts
 * Supports both qualitative categories and numeric bins in a consistent interface
 */
export const BarGroupedStacked: React.FC<BarGroupedStackedProps> = ({
  title,
  mode,
  rows,
  valueKey,
  categories = [],
  bins = [0, 1, 2, 3, 4, 5],
  displayLabels = {},
  height = 350,
  yAxisLabel = "Jumlah Desa"
}) => {
  const { ref, ready, width } = useDeferredMeasure();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Helper to get display label (shorter version for charts)
  const getDisplayLabel = (originalLabel: string) => {
    return displayLabels[originalLabel] || originalLabel;
  };

  // Transform data based on mode
  const chartData = React.useMemo(() => {
    if (mode === 'qualitative') {
      const data = perKecamatanByCategory(rows, valueKey, categories);
      return {
        kecamatanList: data.map(item => item.kecamatan),
        series: data.length > 0 ? 
          data[0].series.map((seriesItem, index) => ({
            name: getDisplayLabel(seriesItem.name), // Use shorter display label
            originalName: seriesItem.name, // Keep original for data matching
            data: data.map(kecData => 
              kecData.series.find(s => s.name === seriesItem.name)?.value || 0
            ),
            color: getCategoryColor(seriesItem.name, index) // Use original name for color
          })) : []
      };
    } else {
      const { categories: binCategories, rows: binData } = perKecamatanByBins(rows, valueKey, bins);
      return {
        kecamatanList: binData.map(item => item.kecamatan),
        series: binCategories.map((category, index) => ({
          name: category,
          data: binData.map(kecData => 
            kecData.series.find(s => s.name === category)?.value || 0
          ),
          color: getBinColor(index)
        }))
      };
    }
  }, [mode, rows, valueKey, categories, bins]);

  // Prepare legend items
  const legendItems: LegendItem[] = chartData.series.map(series => ({
    label: series.name,
    color: series.color
  }));

  // Calculate totals for validation
  const totalData = chartData.series.reduce((sum, series) => 
    sum + series.data.reduce((seriesSum, value) => seriesSum + value, 0), 0
  );

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      stacked: true,
      toolbar: { show: false },
      animations: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        dataLabels: {
          position: 'center' as const,
          hideOverflowingLabels: true
        }
      }
    },
    colors: chartData.series.map(series => series.color),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val > 0 ? val.toString() : '',
      style: {
        fontSize: '10px',
        fontWeight: '600',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        blur: 2,
        opacity: 0.8
      }
    },
    xaxis: {
      categories: chartData.kecamatanList,
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
      },
      axisBorder: {
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
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          const seriesName = chartData.series[seriesIndex]?.name || '';
          const categoryLabel = mode === 'numeric-bins' && seriesName.includes('+')
            ? `${seriesName.replace('+', '')} atau lebih BTS`
            : seriesName;
          return `${value} desa (${categoryLabel})`;
        }
      }
    },
    legend: {
      show: false // We use custom legend
    },
    responsive: [{
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '80%'
          }
        },
        dataLabels: {
          style: {
            fontSize: '9px'
          }
        }
      }
    }]
  };

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
      {ready && totalData > 0 && (
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
            filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'bar-chart'}
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
          height: height - (title ? 100 : 80), // Reserve space for legend
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
        ) : totalData === 0 ? (
          // No data state
          <Box
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              py: 4
            }}
          >
            <Typography variant="body2">
              Tidak ada data untuk ditampilkan
            </Typography>
          </Box>
        ) : (
          // Actual chart
          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="bar"
            width="100%"
            height="100%"
          />
        )}
      </Box>

      {/* Legend */}
      {ready && totalData > 0 && legendItems.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <UnifiedLegend
            items={legendItems}
            orientation="horizontal"
            maxItems={8}
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
            {mode === 'qualitative' 
              ? 'Distribusi kategori per kecamatan' 
              : 'Distribusi jumlah per kecamatan (binned)'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BarGroupedStacked;