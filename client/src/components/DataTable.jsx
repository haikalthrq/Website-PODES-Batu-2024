import React from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Button,
  Box
} from '@mui/material';
import { ExpandMore, Download } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const DataTable = ({ rows, categoryIndicators, category, indicator }) => {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const baseCols = [
    { key: 'nama_kecamatan', label: 'Kecamatan' },
    { key: 'nama_desa', label: 'Desa' }
  ];

  const extraCols = indicator === 'Semua'
    ? Object.entries(categoryIndicators[category] || {}).map(([key, label]) => ({ key, label }))
    : [{ key: indicator, label: categoryIndicators[category]?.[indicator] || indicator }];

  const cols = [...baseCols, ...extraCols];

  const handleDownloadExcel = () => {
    // Prepare data for Excel export
    const exportData = rows.map(row => {
      const exportRow = {};
      cols.forEach(col => {
        exportRow[col.label] = row[col.key] ?? '';
      });
      return exportRow;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = cols.map(col => ({
      wch: Math.max(col.label.length, 20) // minimum width
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const categoryName = category.replace(/\s+/g, '_');
    const indicatorName = indicator === 'Semua' ? 'Semua_Indikator' : indicator.replace(/\s+/g, '_');
    const filename = `Ranking_${categoryName}_${indicatorName}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          📋 Tabel Lengkap
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownloadExcel}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': { backgroundColor: '#45a049' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Download Excel
        </Button>
      </Box>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            📊 Lihat Data Lengkap ({rows.length} baris)
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {cols.map(c => (
                  <TableCell key={c.key} sx={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
                    {c.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx} hover>
                  {cols.map(c => (
                    <TableCell key={c.key}>
                      {r[c.key] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f2f6', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          💡 Data berisi {rows.length} baris. Klik "Download Excel" untuk mengunduh dalam format .xlsx
        </Typography>
      </Box>
    </Box>
  );
};

export default DataTable;
