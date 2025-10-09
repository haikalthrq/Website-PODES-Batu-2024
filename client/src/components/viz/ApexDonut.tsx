import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import ChartVisibilityGuard from "./ChartVisibilityGuard";
import { donutOptions } from "./apexDefault";
import { getSeriesColors } from "./vizTheme";
import { ChartDownloadButton } from "../charts/ChartDownloadButton";

interface ApexDonutProps {
  title: string;
  labels: string[];
  series: number[];
  height?: number;
  className?: string;
}

export default function ApexDonut({ 
  title, 
  labels, 
  series, 
  height = 340,
  className = ""
}: ApexDonutProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  const debugLog = (...args: any[]) => {
    if (import.meta.env?.VITE_VIZ_DEBUG === 'true') {
      console.debug('[ApexDonut]', title, ':', ...args);
    }
  };

  // Validate data
  if (!series || !labels || series.length === 0 || labels.length === 0) {
    debugLog('No data provided', { series, labels });
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
    ...donutOptions,
    labels,
    colors,
    title: {
      text: title,
      align: "left" as const,
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color: donutOptions.chart.foreColor
      }
    }
  };

  debugLog('Rendering donut chart', { 
    series, 
    labels, 
    colors: colors.slice(0, series.length) 
  });

  return (
    <div ref={chartContainerRef} style={{ position: 'relative' }}>
      {/* Download Button */}
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
        <ChartDownloadButton
          chartRef={chartContainerRef}
          filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'donut-chart'}
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
              type="donut"
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