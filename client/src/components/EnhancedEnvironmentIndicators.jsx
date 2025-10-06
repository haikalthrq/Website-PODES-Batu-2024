import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import { ExpandMore, TableChart } from '@mui/icons-material';
import { ENVIRONMENT_PALETTES, getPalette, getCategoryColor } from '../theme/environmentPalette';
import { LINGKUNGAN_KEBENCANAAN_INDICATORS } from '../config/indicators/lingkungan_kebencanaan';

// Helper function to format percentages consistently
const formatPercentage = (value) => {
  if (value === null || value === undefined || !isFinite(value)) return '-';
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(2)}%`;
};

/**
 * Universal Enhanced Environment Indicators Component
 * Provides standardized visualization for all Lingkungan & Kebencanaan indicators
 * Following the same pattern as EnhancedInfrastructureIndicators
 */
const EnhancedEnvironmentIndicators = ({ 
  indicatorKey, 
  displayName, 
  rawVillageData = [],
  isOpen = false 
}) => {
  const [detailTableOpen, setDetailTableOpen] = useState(false);

  // Helper: Build qualitative distribution
  const buildQualitativeDistribution = (data, dataKey) => {
    const counts = {};
    let totalWithData = 0;
    
    data.forEach(row => {
      let value = row[dataKey];
      // Normalize empty/null values
      if (!value || value === '' || value === null) {
        value = 'Tidak Terdefinisi';
      }
      counts[value] = (counts[value] || 0) + 1;
      totalWithData++;
    });

    return {
      distribution: Object.entries(counts).map(([category, count]) => ({
        category,
        count,
        percentage: totalWithData > 0 ? (count / totalWithData) * 100 : 0
      })),
      totalWithData,
      totalVillages: data.length
    };
  };

  // Helper: Build ranking data (sorted by count)
  const buildRankingData = (distribution) => {
    return [...distribution].sort((a, b) => b.count - a.count);
  };

  // Helper: Build by district data
  const buildByDistrict = (data, dataKey) => {
    const districts = ['BATU', 'BUMIAJI', 'JUNREJO'];
    const categoryCountsByDistrict = {};
    
    // Initialize
    districts.forEach(district => {
      categoryCountsByDistrict[district] = {};
    });
    
    // Count by district and category
    data.forEach(row => {
      const district = row.nama_kecamatan;
      let category = row[dataKey];
      
      // Normalize empty/null values
      if (!category || category === '' || category === null) {
        category = 'Tidak Terdefinisi';
      }
      
      if (categoryCountsByDistrict[district]) {
        categoryCountsByDistrict[district][category] = 
          (categoryCountsByDistrict[district][category] || 0) + 1;
      }
    });

    // Get all unique categories
    const allCategories = new Set();
    Object.values(categoryCountsByDistrict).forEach(districtData => {
      Object.keys(districtData).forEach(cat => allCategories.add(cat));
    });
    
    const categories = Array.from(allCategories);
    
    // Build series data for stacked chart
    const series = categories.map(category => ({
      name: category,
      type: 'bar',
      stack: 'total',
      data: districts.map(district => 
        categoryCountsByDistrict[district][category] || 0
      ),
      itemStyle: {
        color: getCategoryColor(dataKey, category)
      }
    }));

    return { districts, categories, series };
  };

  // Compute data for charts
  const chartData = useMemo(() => {
    console.log('EnhancedEnvironmentIndicators chartData calculation:', {
      indicatorKey,
      rawVillageDataLength: rawVillageData?.length,
      rawVillageDataSample: rawVillageData?.slice(0, 2)
    });
    
    if (!rawVillageData.length) return null;
    
    const { distribution, totalWithData, totalVillages } = 
      buildQualitativeDistribution(rawVillageData, indicatorKey);
    
    const ranking = buildRankingData(distribution);
    const byDistrict = buildByDistrict(rawVillageData, indicatorKey);
    
    // Calculate KPI stats
    const dominantCategory = ranking[0] || { category: '-', count: 0, percentage: 0 };
    const uniqueCategories = distribution.length;
    
    return {
      distribution,
      ranking,
      byDistrict,
      kpis: {
        dominantCategory: dominantCategory.category,
        dominantPercentage: dominantCategory.percentage,
        totalCategories: uniqueCategories,
        totalVillages,
        villagesWithData: totalWithData
      }
    };
  }, [rawVillageData, indicatorKey]);

  // Chart option factories
  const makePieChart = (distribution, title) => {
    const palette = getPalette(indicatorKey);
    
    return {
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} desa ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        type: 'scroll',
        itemWidth: 14,
        itemHeight: 14
      },
      series: [{
        name: displayName,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        data: distribution.map(item => ({
          value: item.count,
          name: item.category,
          itemStyle: {
            color: getCategoryColor(indicatorKey, item.category)
          }
        }))
      }]
    };
  };

  const makeHorizontalBarChart = (ranking, title) => {
    return {
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '25%',
        right: '10%',
        top: '15%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Jumlah Desa',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { show: true },
        splitLine: { 
          show: true, 
          lineStyle: { color: '#f0f0f0' } 
        }
      },
      yAxis: {
        type: 'category',
        name: 'Kategori',
        nameLocation: 'middle',
        nameGap: 50,
        data: ranking.map(item => item.category),
        axisLine: { show: true },
        axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: ranking.map(item => ({
          value: item.count,
          itemStyle: {
            color: getCategoryColor(indicatorKey, item.category)
          }
        })),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 4, 4, 0]
        }
      }]
    };
  };

  const makeStackedBarChart = (byDistrict, title) => {
    return {
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach(param => {
            result += `${param.marker} ${param.seriesName}: ${param.value} desa<br/>`;
          });
          return result;
        }
      },
      legend: {
        bottom: 10,
        type: 'scroll',
        itemWidth: 14,
        itemHeight: 14
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        bottom: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: 'Kecamatan',
        nameLocation: 'middle',
        nameGap: 30,
        data: byDistrict.districts,
        axisLine: { show: true },
        axisTick: { show: true }
      },
      yAxis: {
        type: 'value',
        name: 'Jumlah Desa',
        nameLocation: 'middle',
        nameGap: 40,
        axisLine: { show: true },
        splitLine: { 
          show: true, 
          lineStyle: { color: '#f0f0f0' } 
        }
      },
      series: byDistrict.series
    };
  };



  if (!chartData) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Tidak ada data untuk filter saat ini.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* KPI Cards Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%', bgcolor: '#f8fafc' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Kategori Dominan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {chartData.kpis.dominantCategory}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%', bgcolor: '#fef3c7' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Persentase Dominan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d97706' }}>
                {formatPercentage(chartData.kpis.dominantPercentage)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%', bgcolor: '#e0f2fe' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Kategori
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0284c7' }}>
                {chartData.kpis.totalCategories.toLocaleString('id-ID')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%', bgcolor: '#f0fdf4' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Desa
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669' }}>
                {chartData.kpis.totalVillages.toLocaleString('id-ID')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ height: '100%', bgcolor: '#fdf2f8' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Desa dengan Data
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#be185d' }}>
                {chartData.kpis.villagesWithData.toLocaleString('id-ID')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        📊 Visualisasi Data
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', p: 2 }}>
              <ReactECharts
                option={makePieChart(chartData.distribution, `Distribusi ${displayName}`)}
                style={{ height: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Horizontal Bar Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', p: 2 }}>
              <ReactECharts
                option={makeHorizontalBarChart(chartData.ranking, `Jumlah Desa per Kategori: ${displayName}`)}
                style={{ height: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Stacked Bar Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: '100%', p: 2 }}>
              <ReactECharts
                option={makeStackedBarChart(chartData.byDistrict, `Distribusi ${displayName} per Kecamatan`)}
                style={{ height: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detail Table Section */}
      <Accordion 
        expanded={detailTableOpen} 
        onChange={(event, isExpanded) => setDetailTableOpen(isExpanded)}
        sx={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: 2,
          '&:before': { display: 'none' },
          boxShadow: 'none'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ 
            bgcolor: '#f8fafc',
            borderRadius: detailTableOpen ? '8px 8px 0 0' : 2,
            '& .MuiAccordionSummary-content': { alignItems: 'center' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <TableChart sx={{ color: '#6366f1' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Data Detail per Desa
            </Typography>
            <Chip 
              label={`${rawVillageData.length} desa`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ p: 0 }}>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }}>
                    Desa
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }}>
                    Kecamatan
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }}>
                    {displayName}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rawVillageData.map((row, index) => {
                  let value = row[indicatorKey];
                  if (!value || value === '' || value === null) {
                    value = 'Tidak Terdefinisi';
                  }
                  
                  return (
                    <TableRow key={index} hover>
                      <TableCell>{row.nama_desa}</TableCell>
                      <TableCell>{row.nama_kecamatan}</TableCell>
                      <TableCell>
                        <Chip
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: getCategoryColor(indicatorKey, value),
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EnhancedEnvironmentIndicators;