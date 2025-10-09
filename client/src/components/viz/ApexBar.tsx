import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import ChartVisibilityGuard from "./ChartVisibilityGuard";
import { barOptions } from "./apexDefault";
import { getSeriesColors } from "./vizTheme";
import { ChartDownloadButton } from "../charts/ChartDownloadButton";

interface ApexBarProps {
  title: string;
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
  horizontal?: boolean;
  height?: number;
  className?: string;
}

export default function ApexBar({ 
  title, 
  categories, 
  series, 
  horizontal = false,
  height = 360,
  className = ""
}: ApexBarProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  const debugLog = (...args: any[]) => {
    if (import.meta.env?.VITE_VIZ_DEBUG === 'true') {
      console.debug('[ApexBar]', title, ':', ...args);
    }
  };

  // Validate data
  if (!series || !categories || series.length === 0 || categories.length === 0) {
    debugLog('No data provided', { series, categories });
    return (
      <div 
        className={className}
        style={{ 
          height, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#6b7280" 
        }}
      >
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Get colors for the number of series
  const colors = getSeriesColors(series.length);
  
  const chartOptions = {
    ...barOptions,
    colors,
    title: {
      text: title,
      align: "left" as const,
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color: barOptions.chart.foreColor
      }
    },
    xaxis: {
      ...barOptions.xaxis,
      categories
    },
    plotOptions: {
      bar: {
        ...barOptions.plotOptions.bar,
        horizontal,
        borderRadius: horizontal ? 6 : 6,
        borderRadiusApplication: "end" as const,
        borderRadiusWhenStacked: "last" as const
      }
    }
  };

  debugLog('Rendering bar chart', { 
    series: series.map(s => ({ name: s.name, dataLength: s.data.length })), 
    categories: categories.length,
    horizontal,
    colors: colors.slice(0, series.length) 
  });

  return (
    <div ref={chartContainerRef} style={{ position: 'relative' }}>
      {/* Download Button */}
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
        <ChartDownloadButton
          chartRef={chartContainerRef}
          filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'bar-chart'}
          size="small"
        />
      </div>
      
      <ChartVisibilityGuard 
        minHeight={height}
        className={className}
        onVisible={() => debugLog('Chart became visible')}
        render={({ width }) => {
          debugLog('Rendering with dimensions', { width, height });
          
          return (
            <ReactApexChart 
              type="bar"
              width={width}
              height={height} // Use fixed height instead of container height
              series={series}
              options={chartOptions}
            />
          );
        }}
      />
    </div>
  );
}