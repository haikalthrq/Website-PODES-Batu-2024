import React, { useMemo } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ExpandMore, TableChart } from '@mui/icons-material';
import { buildStats, buildCharts, buildDetailTable } from '../../adapters/environmentDataAdapter';
import StatCards from '../unified/StatCards';
import ChartEngine from '../unified/ChartEngine';

/**
 * Thin shell component for Environment indicators
 * Minimal logic - just wires config + transformers + engine
 */
export default function EnvironmentIndicatorShell({ 
  indicatorKey, 
  villageData = [], 
  config, 
  isOpen = false 
}) {
  const [detailTableOpen, setDetailTableOpen] = React.useState(false);

  // Memoize heavy computations
  const { stats, charts, detailTable } = useMemo(() => {
    if (!config || !Array.isArray(villageData) || villageData.length === 0) {
      return {
        stats: {},
        charts: [],
        detailTable: { headers: [], rows: [] }
      };
    }

    return {
      stats: buildStats(villageData, config),
      charts: buildCharts(villageData, config),
      detailTable: buildDetailTable(villageData, config)
    };
  }, [villageData, config]);

  if (!config) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Konfigurasi indikator tidak ditemukan
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(villageData) || villageData.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Tidak ada data untuk filter saat ini
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Stats Cards Row */}
      <StatCards stats={stats} />

      {/* Charts Row */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          📊 Visualisasi Data
        </Typography>
        <ChartEngine charts={charts} heightHint={400} />
      </Box>

      {/* Detail Table */}
      <Box sx={{ mb: 2 }}>
        <Accordion 
          expanded={detailTableOpen}
          onChange={() => setDetailTableOpen(!detailTableOpen)}
          sx={{ boxShadow: 1 }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableChart color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Data Detail per Desa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({detailTable.rows.length} desa)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small" aria-label="detail table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    {detailTable.headers.map((header) => (
                      <TableCell 
                        key={header.key}
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      >
                        {header.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailTable.rows.map((row, index) => (
                    <TableRow 
                      key={`${row.nama_desa}-${index}`}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      {detailTable.headers.map((header) => (
                        <TableCell key={header.key} sx={{ fontSize: '0.875rem' }}>
                          {row[header.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}