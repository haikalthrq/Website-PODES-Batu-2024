/**
 * Universal Full Data Table Component
 * Displays complete data for any category with proper sorting, export, and formatting
 */
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
import { getColumnsForCategory } from '../../../config/table/index.js';
import { multiSort, updateSortState } from '../../../analysis/utils/sorters.js';
import { exportToExcel, generateExportFilename } from '../../../analysis/utils/exporters.js';

/**
 * FullDataTable Props
 * @param {string} categoryKey - Category identifier
 * @param {Array} rows - Raw data rows from API
 * @param {string} className - Additional CSS classes
 * @param {Function} onExport - Custom export handler (optional)
 * @param {boolean} debug - Enable debug logging
 */
const FullDataTable = ({ 
  categoryKey, 
  rows = [], 
  className = '',
  onExport,
  debug = false
}) => {
  const [sortState, setSortState] = useState([]);
  
  // Get column configuration for this category
  const columns = useMemo(() => {
    const cols = getColumnsForCategory(categoryKey);
    if (debug) {
      console.log(`[FullDataTable] Columns for ${categoryKey}:`, cols);
    }
    return cols;
  }, [categoryKey, debug]);

  // Process rows with column accessors for display
  const displayRows = useMemo(() => {
    if (!rows?.length || !columns?.length) return [];
    
    const processed = rows.map((row, index) => {
      const displayRow = { ...row, _originalIndex: index };
      
      // Apply column accessors to get display values
      columns.forEach(column => {
        if (column.accessor && typeof column.accessor === 'function') {
          displayRow[column.key] = column.accessor(row);
        } else {
          // Fallback: use dataKey or key directly
          const value = row[column.dataKey || column.key];
          displayRow[column.key] = value ?? '-';
        }
      });
      
      return displayRow;
    });

    if (debug) {
      console.log(`[FullDataTable] Processed ${processed.length} rows for ${categoryKey}`);
      console.log(`[FullDataTable] Sample processed row:`, processed[0]);
    }

    return processed;
  }, [rows, columns, debug]);

  // Sort processed rows
  const sortedRows = useMemo(() => {
    if (!sortState.length) return displayRows;
    
    // Convert sortState to use column keys for multiSort
    const adaptedSortState = sortState.map(sort => ({
      ...sort,
      key: sort.key // This should match column.key which is the display key
    }));
    
    return multiSort(displayRows, adaptedSortState, columns);
  }, [displayRows, sortState, columns]);

  // Handle column header click for sorting
  const handleSortClick = useCallback((columnKey) => {
    const newSortState = updateSortState(sortState, columnKey, null);
    setSortState(newSortState);
  }, [sortState]);

  // Handle export to Excel
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(sortedRows, columns);
    } else {
      const filename = generateExportFilename(categoryKey);
      exportToExcel(sortedRows, columns, filename);
    }
  }, [onExport, sortedRows, columns, categoryKey]);

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
  if (!displayRows?.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }} className={className}>
        <Typography variant="body1" color="text.secondary">
          Tidak ada data untuk ditampilkan
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={className} sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Tabel Lengkap ({displayRows.length} baris)
          </Typography>
          <Tooltip title="Klik header kolom untuk mengurutkan data">
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          size="small"
          sx={{ 
            minWidth: 120,
            bgcolor: '#22c55e',
            color: 'white',
            '&:hover': {
              bgcolor: '#16a34a'
            },
            '&:active': {
              bgcolor: '#15803d'
            },
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)'
          }}
        >
          Download Excel
        </Button>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.type === 'number' ? 'right' : 'left'}
                  aria-sort={getAriaSort(column.key)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'grey.100',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                      bgcolor: 'grey.200'
                    },
                    width: column.width || 'auto',
                    minWidth: column.width ? `${column.width}px` : 'auto'
                  }}
                  onClick={() => handleSortClick(column.key)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: column.type === 'number' ? 'flex-end' : 'flex-start',
                      gap: 0.5
                    }}
                  >
                    <Typography variant="subtitle2" component="span">
                      {column.label}
                    </Typography>
                    {renderSortIcon(column.key)}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row, index) => (
              <TableRow 
                key={row._originalIndex ?? index}
                hover
                sx={{ 
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.type === 'number' ? 'right' : 'left'}
                    sx={{
                      py: 1,
                      fontVariantNumeric: column.type === 'number' ? 'tabular-nums' : 'normal',
                      color: 'text.primary'
                    }}
                  >
                    {row[column.key]}
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
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Total: {displayRows.length} desa/kelurahan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kategori: {categoryKey}
        </Typography>
      </Box>
      
      {/* Debug info */}
      {debug && (
        <Box sx={{ p: 2, bgcolor: 'yellow.50', fontSize: '0.75rem' }}>
          <Typography variant="caption">
            [DEBUG] Category: {categoryKey} | Columns: {columns.length} | Rows: {displayRows.length}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FullDataTable;