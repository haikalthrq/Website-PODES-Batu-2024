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
  Alert,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  FileDownload,
  LocationOn
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import * as XLSX from 'xlsx';
import { streamlitColors } from '../utils/streamlitColors';
import { ChartDownloadButton } from './charts/ChartDownloadButton';

// DEPRECATED: This component is replaced by UniversalIndicatorPanel  
// TODO: Remove this file after confirming no external dependencies
const EnhancedQualitativeViz = ({ 
  data, 
  column, 
  title, 
  loading = false 
}) => {
  const theme = useTheme();

  // Process and analyze data
  const analysisData = useMemo(() => {
    if (!data || data.length === 0 || !column) return null;

    // Clean data
    const cleanData = data.filter(item => 
      item[column] !== null && 
      item[column] !== undefined && 
      item[column] !== ''
    );

    if (cleanData.length === 0) return null;

    // Count values
    const valueCounts = {};
    cleanData.forEach(item => {
      const value = item[column];
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    // Create pie chart data
    const pieData = Object.entries(valueCounts)
      .sort(([,a], [,b]) => b - a) // Sort by count descending
      .map(([value, count], index) => ({
        label: value,
        count,
        percentage: (count / cleanData.length) * 100
      }));

    // Create bar chart data (sorted by count)
    const barData = [...pieData].reverse(); // Reverse for better bar chart display

    // Geographic distribution by kecamatan
    const kecamatanDistribution = {};
    if (data[0]?.nama_kecamatan) {
      cleanData.forEach(item => {
        const kecamatan = item.nama_kecamatan;
        const value = item[column];
        
        if (!kecamatanDistribution[kecamatan]) {
          kecamatanDistribution[kecamatan] = {};
        }
        kecamatanDistribution[kecamatan][value] = (kecamatanDistribution[kecamatanDistribution[kecamatan][value]] || 0) + 1;
      });
    }

    // Group data by categories for detailed view
    const categoryGroups = {};
    cleanData.forEach(item => {
      const value = item[column];
      if (!categoryGroups[value]) {
        categoryGroups[value] = [];
      }
      categoryGroups[value].push(item);
    });

    // Statistics
    const stats = {
      totalValid: cleanData.length,
      totalCategories: Object.keys(valueCounts).length,
      dominantCategory: pieData[0]?.label,
      dominantCount: pieData[0]?.count,
      dominantPercentage: pieData[0]?.percentage
    };

    return {
      cleanData,
      pieData,
      barData,
      kecamatanDistribution,
      categoryGroups,
      stats
    };
  }, [data, column]);

  // Color palette matching Streamlit
  const COLORS = streamlitColors.qualitative;

  // Refs for download
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Excel download function
  const handleDownloadExcel = () => {
    if (!analysisData?.cleanData) return;

    const exportData = analysisData.cleanData.map(item => ({
      Desa: item.nama_desa,
      Kecamatan: item.nama_kecamatan,
      [title]: item[column]
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Kualitatif');

    const fileName = `Data_Kualitatif_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            p: 1.5,
            border: '1px solid #e5e7eb',
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {data.label}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {data.count} desa ({(() => {
              const rounded = Math.round(data.percentage * 100) / 100;
              return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(2)}%`;
            })()})
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto', mb: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 2 }} />
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

  const { pieData, barData, kecamatanDistribution, categoryGroups, stats } = analysisData;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column: Donut Chart */}
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
                  chartRef={pieChartRef}
                  filename={`distribusi-kategori-${title?.toLowerCase().replace(/\s+/g, '-') || 'chart'}`}
                  size="small"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🍩 Distribusi Kategori
              </Typography>

              <Box ref={pieChartRef} sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => `${value} (${entry.payload.count})`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Statistics Cards */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">👑 Dominan</Typography>
                    <Typography variant="h6" color="primary">{stats.dominantCategory}</Typography>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">📈 Persentase</Typography>
                    <Typography variant="h6" color="secondary">
                      {stats.dominantPercentage !== undefined ? 
                        (() => {
                          const rounded = Math.round(stats.dominantPercentage * 100) / 100;
                          return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(2)}%`;
                        })() 
                        : '-'
                      }
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">🎯 Kategori</Typography>
                    <Typography variant="h6">{stats.totalCategories}</Typography>
                  </Card>
                </Grid>
                <Grid size={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="body2" color="text.secondary">🏘️ Total Desa</Typography>
                    <Typography variant="h6">{stats.totalValid}</Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Ranking Bar Chart */}
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
                  chartRef={barChartRef}
                  filename={`ranking-kategori-${title?.toLowerCase().replace(/\s+/g, '-') || 'chart'}`}
                  size="small"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📊 Ranking Kategori
              </Typography>

              <Box ref={barChartRef} sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="label"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} desa`, 'Jumlah']}
                      labelFormatter={(label) => `Kategori: ${label}`}
                    />
                    <Bar dataKey="count">
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Percentage Details */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>🎯 Persentase Detail</Typography>
                {pieData.slice(0, 4).map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      <Box component="span" sx={{ 
                        display: 'inline-block', 
                        width: 12, 
                        height: 12, 
                        bgcolor: COLORS[index % COLORS.length],
                        borderRadius: '50%',
                        mr: 1
                      }} />
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.count} desa ({item.percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Geographic Distribution */}
      {Object.keys(kecamatanDistribution).length > 1 && (
        <Card elevation={2} sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🗺️ Distribusi per Kecamatan
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(kecamatanDistribution).map(([kecamatan, distribution], kecIndex) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kecIndex}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                        {kecamatan}
                      </Typography>
                      <Stack spacing={0.5}>
                        {Object.entries(distribution).map(([value, count], index) => (
                          <Chip
                            key={index}
                            label={`${value}: ${count} desa`}
                            size="small"
                            sx={{
                              bgcolor: COLORS[pieData.findIndex(p => p.label === value) % COLORS.length] + '20',
                              color: COLORS[pieData.findIndex(p => p.label === value) % COLORS.length]
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Expandable Data Detail */}
      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">📋 Data Detail per Desa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Menampilkan data dari {stats.totalValid} desa
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

          {Object.entries(categoryGroups).map(([category, villages], catIndex) => (
            <Box key={catIndex} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1,
                bgcolor: COLORS[catIndex % COLORS.length] + '10',
                borderRadius: 1
              }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: COLORS[catIndex % COLORS.length],
                  borderRadius: '50%'
                }} />
                {category} ({villages.length} desa)
              </Typography>

              <Box sx={{ maxHeight: 200, overflow: 'auto', ml: 2 }}>
                <Grid container spacing={1} sx={{ mb: 1, fontWeight: 600, bgcolor: 'grey.100', p: 1 }}>
                  <Grid size={6}>Desa</Grid>
                  <Grid size={4}>Kecamatan</Grid>
                  <Grid size={2}>Status</Grid>
                </Grid>
                {villages.slice(0, 20).map((village, index) => (
                  <Grid container spacing={1} key={index} sx={{ p: 1, '&:hover': { bgcolor: 'grey.50' } }}>
                    <Grid size={6}>
                      <Typography variant="body2">{village.nama_desa}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">{village.nama_kecamatan}</Typography>
                    </Grid>
                    <Grid size={2}>
                      <Chip 
                        label={category} 
                        size="small" 
                        sx={{
                          bgcolor: COLORS[catIndex % COLORS.length] + '20',
                          color: COLORS[catIndex % COLORS.length],
                          fontSize: '0.7rem'
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
                {villages.length > 20 && (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 1, fontStyle: 'italic' }}>
                    ... dan {villages.length - 20} desa lainnya
                  </Typography>
                )}
              </Box>
            </Box>
          ))}

          {/* Summary Insights */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>💡 Insights Lengkap</Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                🏆 <strong>Kategori Dominan:</strong> {stats.dominantCategory} dengan {stats.dominantCount} desa ({stats.dominantPercentage?.toFixed(1)}%)
              </Typography>
              <Typography variant="body2">
                🎯 <strong>Diversitas:</strong> Terdapat {stats.totalCategories} kategori berbeda dari {stats.totalValid} desa
              </Typography>
              <Typography variant="body2">
                🗺️ <strong>Sebaran Geografis:</strong> Data tersebar di {Object.keys(kecamatanDistribution).length} kecamatan
              </Typography>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EnhancedQualitativeViz;