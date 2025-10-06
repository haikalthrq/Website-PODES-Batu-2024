import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const AllIndicatorsOverview = ({ data, category, indicators, categoryIndicators }) => {
  if (!data || !indicators || data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Tidak ada data untuk ditampilkan
        </Typography>
      </Paper>
    );
  }

  // Calculate summary statistics for each indicator
  const indicatorStats = Object.keys(indicators).map(indicatorKey => {
    const values = data.map(row => row[indicatorKey]).filter(v => v !== undefined && v !== null);
    const numericValues = values.map(v => 
      typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, '.'))
    ).filter(v => !Number.isNaN(v));
    
    const isNumeric = numericValues.length === values.length && values.length > 0;
    
    let stats = {
      key: indicatorKey,
      label: indicators[indicatorKey],
      type: isNumeric ? 'quantitative' : 'qualitative',
      totalRows: values.length
    };

    if (isNumeric) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      
      stats = {
        ...stats,
        total: sum,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues)
      };
    } else {
      const counts = values.reduce((acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {});
      const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      
      stats = {
        ...stats,
        uniqueValues: Object.keys(counts).length,
        mostCommon: mostCommon ? mostCommon[0] : '-',
        mostCommonCount: mostCommon ? mostCommon[1] : 0,
        distribution: counts
      };
    }

    return stats;
  });

  const quantitativeIndicators = indicatorStats.filter(stat => stat.type === 'quantitative');
  const qualitativeIndicators = indicatorStats.filter(stat => stat.type === 'qualitative');

  return (
    <Box>
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quantitativeIndicators.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📊 Indikator Kuantitatif
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {quantitativeIndicators.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Indikator dengan nilai numerik
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {qualitativeIndicators.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📋 Indikator Kualitatif
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {qualitativeIndicators.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Indikator dengan nilai kategorikal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Detailed Statistics */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📈 Ringkasan Statistik Semua Indikator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Statistik detail untuk setiap indikator dalam kategori {category}
          </Typography>
        </Box>

        {/* Quantitative Indicators */}
        {quantitativeIndicators.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                📊 Indikator Kuantitatif ({quantitativeIndicators.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Indikator</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Min</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Max</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quantitativeIndicators.map((stat) => (
                    <TableRow key={stat.key} hover>
                      <TableCell>{stat.label}</TableCell>
                      <TableCell align="right">{stat.total?.toLocaleString() || '-'}</TableCell>
                      <TableCell align="right">{stat.min?.toLocaleString() || '-'}</TableCell>
                      <TableCell align="right">{stat.max?.toLocaleString() || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Qualitative Indicators */}
        {qualitativeIndicators.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                📋 Indikator Kualitatif ({qualitativeIndicators.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Indikator</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Nilai Unik</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nilai Terbanyak</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Jumlah</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Data Valid</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {qualitativeIndicators.map((stat) => (
                    <TableRow key={stat.key} hover>
                      <TableCell>{stat.label}</TableCell>
                      <TableCell align="right">{stat.uniqueValues || '-'}</TableCell>
                      <TableCell>{stat.mostCommon || '-'}</TableCell>
                      <TableCell align="right">{stat.mostCommonCount || '-'}</TableCell>
                      <TableCell align="right">{stat.totalRows || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )}
      </Paper>
    </Box>
  );
};

export default AllIndicatorsOverview;