import React, { useRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { useDeferredMeasure } from './useDeferredMeasure';
import { UnifiedLegend, LegendItem } from './UnifiedLegend';
import { getCategoryColor } from '../theme/chartColors';
import { ChartDownloadButton } from './ChartDownloadButton';

export interface DonutDataItem {
  label: string;
  value: number;
  color?: string;
}

export interface DonutWithLegendProps {
  title?: string;
  data: DonutDataItem[];
  totalLabel?: string;
  height?: number;
  showPercentages?: boolean;
  showValues?: boolean;
}

/**
 * Donut chart with centered total and unified legend
 * Uses deferred rendering to prevent accordion mounting issues
 */
export const DonutWithLegend: React.FC<DonutWithLegendProps> = ({
  title,
  data,
  totalLabel = "Total",
  height = 300,
  showPercentages = true,
  showValues = false
}) => {
  const { ref, ready, width } = useDeferredMeasure();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Calculate total and prepare chart data
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.filter(item => item.value > 0);
  
  // Prepare legend items
  const legendItems: LegendItem[] = chartData.map((item, index) => ({
    label: item.label,
    color: item.color || getCategoryColor(item.label, index)
  }));

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: { show: false },
      animations: { enabled: false }, // Disable animations for consistent rendering
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151'
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              formatter: () => total.toString()
            },
            total: {
              show: true,
              label: totalLabel,
              fontSize: '12px',
              color: '#6b7280',
              formatter: () => total.toString()
            }
          }
        }
      }
    },
    colors: chartData.map((item, index) => 
      item.color || getCategoryColor(item.label, index)
    ),
    labels: chartData.map(item => item.label),
    legend: {
      show: false // We use our custom legend
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value: number) => {
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${value} desa (${percentage}%)`;
        }
      }
    },
    dataLabels: {
      enabled: showPercentages || showValues,
      formatter: (val: number, opts: any) => {
        const value = chartData[opts.seriesIndex]?.value || 0;
        if (showValues && showPercentages) {
          return `${value}\n(${val.toFixed(1)}%)`;
        } else if (showValues) {
          return value.toString();
        } else {
          return `${val.toFixed(1)}%`;
        }
      },
      style: {
        fontSize: '11px',
        fontWeight: '500',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        blur: 2,
        opacity: 0.8
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        plotOptions: {
          pie: {
            donut: {
              size: '75%'
            }
          }
        },
        dataLabels: {
          style: {
            fontSize: '10px'
          }
        }
      }
    }]
  };

  const series = chartData.map(item => item.value);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Download Button */}
      {ready && chartData.length > 0 && (
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
            filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'donut-chart'}
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
            mb: 1,
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
          height: height - (title ? 60 : 40), // Reserve space for legend
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!ready ? (
          // Skeleton while measuring
          <Skeleton
            variant="circular"
            width={Math.min(width * 0.8, 200)}
            height={Math.min(width * 0.8, 200)}
          />
        ) : chartData.length === 0 ? (
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
            series={series}
            type="donut"
            width="100%"
            height="100%"
          />
        )}
      </Box>

      {/* Legend */}
      {ready && chartData.length > 0 && (
        <UnifiedLegend
          items={legendItems}
          orientation="horizontal"
          maxItems={6}
        />
      )}
    </Box>
  );
};

export default DonutWithLegend;