import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  ExpandMore,
  TableChart,
  Analytics,
  GetApp,
  FileDownload
} from '@mui/icons-material';

/**
 * QuantitativeDataTable - Accordion table showing raw quantitative data
 * Village x Indicator matrix with proper formatting and export capability
 */
const QuantitativeDataTable = ({ 
  tableRows, 
  tableColumns, 
  title = 'Tabel Data Kuantitatif' 
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange}
      elevation={0}
      sx={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: 2,
        mb: 2,
        '&:before': {
          display: 'none',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="quantitative-data-content"
        id="quantitative-data-header"
        sx={{
          backgroundColor: '#f8fafc',
          borderRadius: expanded ? '8px 8px 0 0' : 2,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <TableChart sx={{ color: '#6366f1' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Chip 
            label={`${tableRows.length} desa`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0 }}>
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            maxHeight: 400,
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              zIndex: 1
            }
          }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#fafafa'
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    }
                  }}
                >
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{
                        py: 1.5,
                        fontSize: '0.875rem'
                      }}
                    >
                      {column.align === 'right' && typeof row[column.key] === 'number'
                        ? row[column.key].toLocaleString('id-ID')
                        : row[column.key] || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            📋 Menampilkan data mentah untuk {tableRows.length} desa yang dipilih
          </Typography>
          <Tooltip title="Export tabel (fitur akan datang)">
            <IconButton size="small" disabled>
              <GetApp />
            </IconButton>
          </Tooltip>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * ComparisonSummaryTable - Accordion table showing comparison summary
 * Includes totals and rankings for easy comparison with Excel download
 */
const ComparisonSummaryTable = ({ 
  summaryData, 
  indicatorConfigs,
  title = 'Ringkasan Lengkap Perbandingan',
  showTotal = true, // New prop to control total column visibility
  hasQualitativeData = false // New prop to indicate qualitative data
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = ['Peringkat', 'Desa (Kecamatan)', ...indicatorConfigs.map(ind => ind.label)];
    if (showTotal) headers.push('Total');
    
    const csvContent = [
      headers.join(','),
      ...summaryData.map((row, index) => {
        const rowData = [
          index + 1,
          `"${row.desaKecamatan}"`,
          ...indicatorConfigs.map(ind => row[ind.key] || (hasQualitativeData ? '"-"' : 0))
        ];
        if (showTotal) rowData.push(row.total || 0);
        return rowData.join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ringkasan_perbandingan_desa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankingColor = (index) => {
    switch(index) {
      case 0: return '#d4af37'; // Gold
      case 1: return '#c0c0c0'; // Silver
      case 2: return '#cd7f32'; // Bronze
      default: return '#6b7280'; // Default gray
    }
  };

  const getRankingIcon = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={handleChange}
      elevation={0}
      sx={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: 2,
        mb: 2,
        '&:before': {
          display: 'none',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="summary-data-content"
        id="summary-data-header"
        sx={{
          backgroundColor: '#f8fafc',
          borderRadius: expanded ? '8px 8px 0 0' : 2,
          '& .MuiAccordionSummary-content': {
            alignItems: 'center'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Analytics sx={{ color: '#f59e0b' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {showTotal && (
            <Chip 
              label="Diurutkan berdasarkan total" 
              size="small" 
              color="warning" 
              variant="outlined" 
            />
          )}
          {hasQualitativeData && (
            <Chip 
              label="Data kualitatif" 
              size="small" 
              color="info" 
              variant="outlined" 
            />
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 0 }}>
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            maxHeight: 400,
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              zIndex: 1
            }
          }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb'
                  }}
                >
                  Peringkat
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    backgroundColor: '#f1f5f9',
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb'
                  }}
                >
                  Desa (Kecamatan)
                </TableCell>
                {indicatorConfigs.map((indicator) => (
                  <TableCell
                    key={indicator.key}
                    align={hasQualitativeData ? "left" : "right"}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb'
                    }}
                  >
                    {indicator.label}
                  </TableCell>
                ))}
                {showTotal && (
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      borderBottom: '2px solid #f59e0b'
                    }}
                  >
                    Total
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, index) => (
                <TableRow
                  key={row.desa}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#fafafa'
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    },
                    ...(index < 3 && {
                      backgroundColor: `${getRankingColor(index)}08`,
                      '&:hover': {
                        backgroundColor: `${getRankingColor(index)}15`
                      }
                    })
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: getRankingColor(index)
                        }}
                      >
                        {getRankingIcon(index)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
                    {row.desaKecamatan}
                  </TableCell>
                  {indicatorConfigs.map((indicator) => (
                    <TableCell 
                      key={indicator.key} 
                      align={hasQualitativeData ? "left" : "right"} 
                      sx={{ py: 1.5 }}
                    >
                      {hasQualitativeData 
                        ? (row[indicator.key] || '-')
                        : (row[indicator.key]?.toLocaleString('id-ID') || 0)
                      }
                    </TableCell>
                  ))}
                  {showTotal && (
                    <TableCell
                      align="right"
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        color: '#d97706',
                        backgroundColor: '#fef3c7'
                      }}
                    >
                      {row.total?.toLocaleString('id-ID') || 0}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {hasQualitativeData 
              ? "📋 Perbandingan data kualitatif antar desa yang dipilih"
              : "🏆 Ringkasan perbandingan diurutkan berdasarkan total nilai tertinggi"
            }
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleDownloadExcel}
            sx={{
              textTransform: 'none',
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                borderColor: '#059669',
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
              }
            }}
          >
            Download Excel
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export { ComparisonSummaryTable };