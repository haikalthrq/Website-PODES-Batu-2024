import React, { useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Chip,
  useTheme,
  Skeleton,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Analytics,
  FileDownload
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LabelList
} from 'recharts';
import * as XLSX from 'xlsx';
import { streamlitColors, streamlitChartConfig } from '../utils/streamlitColors';
import { ChartDownloadButton } from './charts/ChartDownloadButton';

// DEPRECATED: This component is replaced by UniversalIndicatorPanel
// TODO: Remove this file after confirming no external dependencies
const EnhancedQuantitativeViz = ({ 
  data, 
  column, 
  title, 
  loading = false 
}) => {
  const theme = useTheme();
  
  // Debug logging removed to prevent performance issues

  // Helper function for smart labeling
  const getSmartLabel = (column, value) => {
    const intValue = parseInt(value);
    
    if (column.toLowerCase().includes('puskesmas')) {
      return `${intValue} puskesmas`;
    } else if (column.toLowerCase().includes('rumah_sakit') || column.toLowerCase().includes('rs_')) {
      return `${intValue} rumah sakit`;
    } else if (column.toLowerCase().includes('tk')) {
      return `${intValue} TK`;
    } else if (column.toLowerCase().includes('sd')) {
      return `${intValue} SD`;
    } else if (column.toLowerCase().includes('smp')) {
      return `${intValue} SMP`;
    } else if (column.toLowerCase().includes('sma')) {
      return `${intValue} SMA`;
    } else if (column.toLowerCase().includes('posyandu')) {
      return `${intValue} posyandu`;
    }
    
    return intValue.toString();
  };

  // Process and analyze data
  const analysisData = useMemo(() => {
    if (!data || data.length === 0 || !column) return null;

    // Clean data - include zeros but exclude null/undefined/NaN
    const cleanData = data.filter(item => {
      const value = item[column];
      return value !== null && 
             value !== undefined && 
             !isNaN(Number(value)) &&
             item.nama_desa && 
             item.nama_kecamatan;
    }).map(item => ({
      ...item,
      [column]: Number(item[column]) // Ensure numeric values
    }));

    if (cleanData.length === 0) return null;

    // Sort by column value
    const sortedData = [...cleanData].sort((a, b) => b[column] - a[column]);
    
    // Add rankings
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    // Calculate statistics
    const values = cleanData.map(item => item[column]);
    const stats = {
      max: Math.max(...values),
      min: Math.min(...values),
      total: values.reduce((sum, val) => sum + val, 0),
      count: values.length,
      mean: values.reduce((sum, val) => sum + val, 0) / values.length
    };

    // Create top performers (top 12)
    const topPerformers = rankedData.slice(0, Math.min(12, rankedData.length));

    // Create distribution data for histogram
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
    const isDiscrete = uniqueValues.length <= 10;
    
    let distributionData;
    if (isDiscrete) {
      // For discrete data, count occurrences
      distributionData = uniqueValues.map(value => ({
        value,
        count: values.filter(v => v === value).length,
        label: getSmartLabel(column, value)
      }));
    } else {
      // For continuous data, create bins
      const binCount = Math.min(15, uniqueValues.length);
      const binSize = (stats.max - stats.min) / binCount;
      distributionData = [];
      
      for (let i = 0; i < binCount; i++) {
        const binStart = stats.min + i * binSize;
        const binEnd = stats.min + (i + 1) * binSize;
        const count = values.filter(v => v >= binStart && v < binEnd).length;
        
        distributionData.push({
          value: binStart,
          count,
          label: `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`
        });
      }
    }

    return {
      cleanData: rankedData,
      stats,
      topPerformers,
      distributionData,
      isDiscrete,
      isUniform: uniqueValues.length === 1
    };
  }, [data, column]);

  // Excel download function
  const handleDownloadExcel = () => {
    if (!analysisData?.cleanData) return;

    const exportData = analysisData.cleanData.map(item => ({
      Rank: item.rank,
      Desa: item.nama_desa,
      Kecamatan: item.nama_kecamatan,
      [title]: item[column]
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ranking');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    const fileName = `Ranking_Lengkap_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // No data state
  if (!analysisData) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body1">
          ⚠️ Tidak ada data valid untuk indikator "{title}"
        </Typography>
      </Alert>
    );
  }

  const { cleanData, stats, topPerformers, distributionData, isDiscrete, isUniform } = analysisData;

  // Palet warna ramah visualisasi dengan 7 warna berbeda (consistent dengan RankingBarHorizontal)
  const CHART_COLORS = [
    "#2B8DBD", // Blue
    "#7E57C2", // Purple  
    "#26A69A", // Teal
    "#FF7043", // Orange
    "#42A5F5", // Light Blue
    "#66BB6A", // Green
    "#FFCA28"  // Amber
  ];

  // Colors matching new palette
  const primaryColor = CHART_COLORS[0]; // Blue for quantitative main
  const secondaryColor = CHART_COLORS[2]; // Teal for distribution

  // Refs for download
  const rankingChartRef = useRef(null);
  const distributionChartRef = useRef(null);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column: Ranking Visualization */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              {/* Download Button */}
              {!isUniform && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10
                  }}
                >
                  <ChartDownloadButton
                    chartRef={rankingChartRef}
                    filename={`ranking-desa-${title?.toLowerCase().replace(/\s+/g, '-') || 'chart'}`}
                    size="small"
                  />
                </Box>
              )}
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🏆 Ranking Desa
              </Typography>

              {isUniform ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  ✨ Semua desa memiliki nilai seragam: <strong>{stats.max}</strong>
                </Alert>
              ) : (
                <Box ref={rankingChartRef} sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topPerformers.slice().reverse()} // Reverse for proper display
                      layout="horizontal"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="nama_desa"
                        width={90}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value} ${getSmartLabel(column, value).split(' ').slice(-1)[0]}`,
                          title
                        ]}
                        labelFormatter={(label) => `${label} (Rank #${topPerformers.find(item => item.nama_desa === label)?.rank})`}
                      />
                      <Bar dataKey={column}>
                        {topPerformers.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Statistics Cards */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={3}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">🎯 Tertinggi</Typography>
                    <Typography variant="h6" color="primary">{stats.max}</Typography>
                  </Card>
                </Grid>
                <Grid size={3}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">📉 Terendah</Typography>
                    <Typography variant="h6" color="secondary">{stats.min}</Typography>
                  </Card>
                </Grid>
                <Grid size={3}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">🔢 Total</Typography>
                    <Typography variant="h6">{stats.total}</Typography>
                  </Card>
                </Grid>
                <Grid size={3}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">🏘️ Desa</Typography>
                    <Typography variant="h6">{stats.count}</Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Distribution Analysis */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
              {/* Download Button */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10
                }}
              >
                <ChartDownloadButton
                  chartRef={distributionChartRef}
                  filename={`distribusi-${title?.toLowerCase().replace(/\s+/g, '-') || 'chart'}`}
                  size="small"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📊 Analisis Distribusi
              </Typography>

              <Box ref={distributionChartRef} sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} desa`, 'Jumlah']}
                      labelFormatter={(label) => `Nilai: ${label}`}
                    />
                    <Bar dataKey="count">
                      <LabelList dataKey="count" position="top" />
                      {distributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Quick Insights */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>💡 Quick Insights</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📊 <strong>Rata-rata:</strong> {stats.mean.toFixed(1)}
                </Typography>
                <Typography variant="body2">
                  🎯 <strong>Rentang:</strong> {stats.min} - {stats.max}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expandable Table */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📋 Tabel Lengkap</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Menampilkan {cleanData.length} desa dengan data valid
            </Typography>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleDownloadExcel}
              size="small"
              sx={{ bgcolor: streamlitColors.success, '&:hover': { bgcolor: streamlitColors.successDark } }}
            >
              Download Excel
            </Button>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Grid container spacing={1} sx={{ mb: 1, fontWeight: 600, bgcolor: 'grey.100', p: 1 }}>
              <Grid size={1}>Rank</Grid>
              <Grid size={4}>Desa</Grid>
              <Grid size={3}>Kecamatan</Grid>
              <Grid size={2}>{title}</Grid>
              <Grid size={2}>Insights</Grid>
            </Grid>
            {cleanData.slice(0, 50).map((item, index) => (
              <Grid container spacing={1} key={index} sx={{ p: 1, '&:hover': { bgcolor: 'grey.50' } }}>
                <Grid size={1}>
                  <Chip 
                    label={`#${item.rank}`} 
                    size="small" 
                    color={item.rank <= 3 ? "primary" : "default"}
                  />
                </Grid>
                <Grid size={4}>
                  <Typography variant="body2">{item.nama_desa}</Typography>
                </Grid>
                <Grid size={3}>
                  <Typography variant="body2" color="text.secondary">{item.nama_kecamatan}</Typography>
                </Grid>
                <Grid size={2}>
                  <Typography variant="body2" fontWeight={600}>{item[column]}</Typography>
                </Grid>
                <Grid size={2}>
                  {item.rank === 1 && (
                    <Chip label="👑 Terbaik" size="small" color="success" />
                  )}
                  {item[column] === 0 && (
                    <Chip label="❌ Belum Ada" size="small" color="warning" />
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>

          {/* Enhanced Insights */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>💡 Insights Lengkap</Typography>
            {cleanData.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="body2">
                  🏆 <strong>Peringkat Teratas:</strong> {cleanData[0].nama_desa} ({cleanData[0].nama_kecamatan}) 
                  dengan {cleanData[0][column]} {getSmartLabel(column, cleanData[0][column]).split(' ').slice(-1)[0]}
                </Typography>
                {cleanData.length > 1 && (
                  <Typography variant="body2">
                    📊 <strong>Terendah:</strong> {cleanData[cleanData.length - 1].nama_desa} 
                    dengan {cleanData[cleanData.length - 1][column]} {getSmartLabel(column, cleanData[cleanData.length - 1][column]).split(' ').slice(-1)[0]}
                  </Typography>
                )}
                <Typography variant="body2">
                  📈 <strong>Distribusi:</strong> {distributionData.filter(d => d.count > 0).length} kategori nilai berbeda
                </Typography>
              </Stack>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EnhancedQuantitativeViz;