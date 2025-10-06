// Minimal table with per-column sorting & Excel export, always visible on Analysis pages.

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';
import {
  Download,
  Info,
  KeyboardArrowUp,
  KeyboardArrowDown,
  UnfoldMore
} from '@mui/icons-material';
import { multiSort, updateSortState } from '../utils/sorters';
import { exportToExcel, generateExportFilename } from '../utils/exporters';
/**
 * RankingTable - Minimal, clean table with sorting and Excel export
 * @param {Object} props
 * @param {Array} props.rows - Array of row objects
 * @param {Array} props.columns - Array of column configs {key, label, type}
 * @param {Array} props.defaultSort - Default sort config [{key, direction}]
 * @param {string} props.title - Table title
 * @param {string} props.category - Current category for export filename
 * @param {Function} props.onExport - Optional export override
 */
const RankingTable = ({
  rows = [],
  columns = [],
  defaultSort = [
    { key: 'kecamatan', direction: 'asc' },
    { key: 'desa', direction: 'asc' }
  ],
  title = '📑 Tabel Lengkap (24 baris)',
  category = 'data',
  onExport
}) => {
  const [sortState, setSortState] = useState(defaultSort);

  // Sort rows based on current sort state
  const sortedRows = useMemo(() => {
    return multiSort(rows, sortState, columns);
  }, [rows, sortState, columns]);

  // Handle column header click for sorting
  const handleSortClick = useCallback((columnKey) => {
    const newSortState = updateSortState(sortState, columnKey, defaultSort);
    setSortState(newSortState);
  }, [sortState, defaultSort]);

  // Handle export to Excel
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(sortedRows, columns);
    } else {
      const filename = generateExportFilename(category);
      exportToExcel(sortedRows, columns, filename);
    }
  }, [onExport, sortedRows, columns, category]);

  // Get sort direction for a column
  const getSortDirection = (columnKey) => {
    const sortItem = sortState.find(s => s.key === columnKey);
    return sortItem?.direction || null;
  };

  // Get aria-sort value for accessibility
  const getAriaSort = (columnKey) => {
    const direction = getSortDirection(columnKey);
    switch (direction) {
      case 'asc': return 'ascending';
      case 'desc': return 'descending';
      default: return 'none';
    }
  };

  // Render sort icon based on current state
  const renderSortIcon = (columnKey) => {
    const direction = getSortDirection(columnKey);
    switch (direction) {
      case 'asc':
        return <KeyboardArrowUp sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'desc':
        return <KeyboardArrowDown sx={{ fontSize: 16, color: 'primary.main' }} />;
      default:
        return <UnfoldMore sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  // If no data, show message
  if (!rows || rows.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body1">
            Tidak ada data untuk ditampilkan
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: 'white'
      }}
    >
      {/* Header with title and export button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.1rem'
            }}
          >
            {title}
          </Typography>
          <Tooltip title="Data lengkap berdasarkan PODES 2024 dengan ranking otomatis">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Info sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<Download />}
          onClick={handleExport}
          aria-label="Download Excel Tabel Lengkap"
          sx={{
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669'
            },
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Download Excel
        </Button>
      </Box>

      {/* Table container with horizontal scroll */}
      <TableContainer
        sx={{
          maxHeight: '70vh', // Limit height for better UX
          overflowX: 'auto',
          overflowY: 'auto',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            height: 8,
            width: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f5f9'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: 4
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#94a3b8'
          },
          // Mobile shadow hint for horizontal scroll
          '&::after': {
            content: '""',
            position: 'sticky',
            right: 0,
            top: 0,
            width: 20,
            height: '100%',
            background: 'linear-gradient(to left, rgba(0,0,0,0.1), transparent)',
            pointerEvents: 'none',
            zIndex: 1,
            display: { xs: 'block', md: 'none' }
          }
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            fontSize: '0.875rem'
          }}
          aria-label={`Tabel data ${category}`}
        >
          {/* Sticky header */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#f8fafc',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={column.key}
                  scope="col"
                  aria-sort={getAriaSort(column.key)}
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    borderBottom: '2px solid #e5e7eb',
                    backgroundColor: '#f8fafc',
                    px: 2,
                    py: 1.5,
                    fontSize: '0.875rem',
                    textAlign: column.type === 'number' ? 'right' : 'left',
                    minWidth: index === 0 ? 120 : (column.type === 'number' ? 100 : 140)
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleSortClick(column.key)}
                    sx={{
                      color: 'inherit',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      justifyContent: column.type === 'number' ? 'flex-end' : 'flex-start',
                      minWidth: 'auto',
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                    endIcon={renderSortIcon(column.key)}
                  >
                    {column.label}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table body with zebra stripes */}
          <TableBody>
            {sortedRows.map((row, index) => (
              <TableRow
                key={row.id_desa || `${row.kecamatan}-${row.desa}-${index}`}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#fafbff',
                  '&:hover': {
                    backgroundColor: '#f1f5f9'
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      px: 2,
                      py: 1.5,
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      borderBottom: '1px solid #f1f5f9',
                      textAlign: column.type === 'number' ? 'right' : 'left',
                      fontVariantNumeric: column.type === 'number' ? 'tabular-nums' : 'normal',
                      color: 'text.primary'
                    }}
                  >
                    {column.type === 'number' 
                      ? (Number(row[column.dataKey || column.key]) || 0)
                      : (row[column.dataKey || column.key] || '-')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer with row count */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafbfc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          Total: {rows.length} desa/kelurahan
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          Klik header kolom untuk mengurutkan data
        </Typography>
      </Box>
    </Paper>
  );
};

export default RankingTable;