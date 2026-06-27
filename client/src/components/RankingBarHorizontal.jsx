import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartDownloadButton } from './charts/ChartDownloadButton';

// Palet warna ramah visualisasi dengan 7 warna berbeda
const CHART_COLORS = [
  "#2B8DBD", // Blue
  "#7E57C2", // Purple  
  "#26A69A", // Teal
  "#FF7043", // Orange
  "#42A5F5", // Light Blue
  "#66BB6A", // Green
  "#FFCA28"  // Amber
];

const RankingBarHorizontal = ({ 
  data, 
  loading = false, 
  title = "Ranking Desa",
  indicatorName = "Nilai",
  color = '#8b5cf6'
}) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [chartKey, setChartKey] = useState(0);

  // Handle accordion resize dan data changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Only trigger if size actually changed (not just initialization)
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setTimeout(() => {
            setChartKey(prev => prev + 1);
            window.dispatchEvent(new Event('resize'));
          }, 50);
        }
      }
    });

    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Reset chart saat data berubah
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [data, indicatorName]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: 380 }}>
        <Box sx={{ 
          width: '60%', 
          height: 20, 
          bgcolor: 'grey.200', 
          borderRadius: 1,
          mb: 3
        }} />
        <Box sx={{ 
          width: '100%', 
          height: 340, 
          bgcolor: 'grey.100', 
          borderRadius: 2
        }} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        height: 380, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary',
        bgcolor: 'grey.50',
        borderRadius: 2
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📊 Tidak ada data
        </Typography>
        <Typography variant="body2">
          Data tidak tersedia untuk indikator ini
        </Typography>
      </Box>
    );
  }

  // Step 1: Process data dengan rank calculation yang benar (data sudah disort dari parent)
  const rowsSanitized = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data
      .filter(r => r && typeof r.value !== 'undefined') // Filter data yang valid
      .slice(0, 12) // Limit to top 12 for readability
      .map((r, i) => ({
        desa: r.desa || 'Unknown',
        kecamatan: r.kecamatan || 'Unknown', 
        value: Number(r.value ?? 0),
        rank: i + 1, // Rank berdasarkan urutan (data sudah disort)
        label: `${r.desa || 'Unknown'} (${r.kecamatan || 'Unknown'})`
      }))
      .filter(r => !isNaN(r.value)); // Filter NaN setelah conversion
  }, [data]);

  // Step 2: Smart domain calculation dari data TERKINI
  const maxValue = useMemo(() => {
    if (rowsSanitized.length === 0) return 0;
    return Math.max(0, ...rowsSanitized.map(r => r.value));
  }, [rowsSanitized]);

  const xMax = useMemo(() => {
    if (maxValue === 0) return 1; // Show at least 1 unit for empty data
    if (maxValue <= 3) return maxValue + 1; // Add padding for small values
    return Math.ceil(maxValue * 1.15); // 15% padding for larger values
  }, [maxValue]);

  // Guard clauses dengan pesan yang lebih informatif  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ 
        height: 420, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary',
        bgcolor: 'grey.50',
        borderRadius: 2
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📊 Tidak ada data
        </Typography>
        <Typography variant="body2">
          Data tidak tersedia untuk indikator {indicatorName || 'ini'}
        </Typography>
      </Box>
    );
  }

  if (rowsSanitized.length === 0) {
    return (
      <Box sx={{ 
        height: 420, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary',
        bgcolor: 'grey.50',
        borderRadius: 2
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📊 Tidak ada data valid
        </Typography>
        <Typography variant="body2">
          Semua desa memiliki nilai tidak valid untuk {indicatorName || 'indikator ini'}
        </Typography>
      </Box>
    );
  }

  const RankingTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 2,
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          boxShadow: theme.shadows[4]
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {data.desa} ({data.kecamatan}) Rank #{data.rank}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {indicatorName}: {data.value}
          </Typography>
        </Box>
      );
    }
    return null;
  };



  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      
      {/* Download Button */}
      {rowsSanitized.length > 0 && (
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
            filename={`analisis-jumlah-${indicatorName.toLowerCase().replace(/\s+/g, '-')}`}
            size="small"
          />
        </Box>
      )}
      
      {/* Title and summary */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Analisis Jumlah: {indicatorName}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Menampilkan {rowsSanitized.length} desa berdasarkan {indicatorName}
      </Typography>
      
      <Box 
        ref={(el) => {
          containerRef.current = el;
          chartContainerRef.current = el;
        }}
        sx={{ 
          width: '100%', 
          height: 420,
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <ResponsiveContainer 
          width="100%" 
          height="100%" 
          key={`${chartKey}-${rowsSanitized.length}-${maxValue}`}
        >
          <BarChart
            data={rowsSanitized}
            layout="vertical"
            margin={{ 
              top: 8, 
              right: 24, 
              left: 24, 
              bottom: 24 
            }}
            barCategoryGap={20}
            barGap={2}
            syncId={undefined} // Disable synchronization
            throttleDelay={0}  // No throttling
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.3}
            />
            <XAxis 
              type="number" 
              domain={[0, xMax]} 
              allowDecimals={false} 
              tickMargin={8}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              type="category" 
              dataKey="label" 
              width={260} 
              interval={0}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<RankingTooltip />} />
            <Bar 
              dataKey="value" 
              barSize={22} 
              radius={[4, 4, 4, 4]}
            >
              {rowsSanitized.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RankingBarHorizontal;