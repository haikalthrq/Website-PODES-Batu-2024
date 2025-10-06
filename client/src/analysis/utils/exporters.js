/**
 * Export utilities for table data
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} rows - Array of row objects
 * @param {Array} columns - Array of column configurations [{key, label}]
 * @returns {string} CSV string
 */
const arrayToCSV = (rows, columns) => {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return '';
  
  // Create headers
  const headers = columns.map(col => `"${col.label || col.key}"`).join(',');
  
  // Create data rows
  const dataRows = rows.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      // Handle numbers and strings appropriately
      if (typeof value === 'number') {
        return value;
      }
      // Escape quotes in string values
      const stringValue = String(value || '').replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [headers, ...dataRows].join('\n');
};

/**
 * Trigger download of text content as file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
const downloadAsFile = (content, filename, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Export table data to Excel format (CSV with .xlsx extension as fallback)
 * @param {Array} rows - Array of row objects
 * @param {Array} columns - Array of column configurations [{key, label}]
 * @param {string} filename - Base filename (without extension)
 */
export const exportToExcel = (rows, columns, filename) => {
  try {
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.warn('No data to export');
      return;
    }
    
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      console.warn('No columns defined for export');
      return;
    }
    
    // Generate CSV content
    const csvContent = arrayToCSV(rows, columns);
    
    if (!csvContent) {
      console.warn('No content generated for export');
      return;
    }
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '-');
    
    const fullFilename = `${filename}-${timestamp}.csv`;
    
    // Download as CSV (Excel can open CSV files)
    downloadAsFile(csvContent, fullFilename, 'text/csv');
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Terjadi kesalahan saat mengunduh file. Silakan coba lagi.');
  }
};

/**
 * Generate filename for export based on category and current date
 * @param {string} category - Current category name
 * @returns {string} Generated filename
 */
export const generateExportFilename = (category = 'data') => {
  const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `podes-tabel-${cleanCategory}`;
};