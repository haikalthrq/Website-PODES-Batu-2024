/**
 * Sorting utilities for table data with locale support
 */

/**
 * Compare text values using Indonesian locale
 * @param {string} a - First value
 * @param {string} b - Second value  
 * @param {string} locale - Locale code (default: 'id')
 * @param {string} sensitivity - Sensitivity level (default: 'base')
 * @returns {number} Comparison result
 */
export const localeTextCmp = (a, b, locale = 'id', sensitivity = 'base') => {
  const strA = String(a || '').trim();
  const strB = String(b || '').trim();
  return strA.localeCompare(strB, locale, { sensitivity });
};

/**
 * Compare numeric values safely
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {number} Comparison result
 */
export const numberCmp = (a, b) => {
  const numA = Number(a) || 0;
  const numB = Number(b) || 0;
  return numA - numB;
};

/**
 * Multi-column stable sort for table rows
 * @param {Array} rows - Array of row objects
 * @param {Array} sortState - Array of sort configurations [{key, direction}]
 * @param {Array} columns - Array of column configurations [{key, type}]
 * @returns {Array} Sorted array
 */
export const multiSort = (rows, sortState, columns) => {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return rows;
  if (!sortState || !Array.isArray(sortState) || sortState.length === 0) return rows;

  // Create column type and dataKey lookup
  const columnTypes = {};
  const columnDataKeys = {};
  columns?.forEach(col => {
    columnTypes[col.key] = col.type || 'text';
    columnDataKeys[col.key] = col.dataKey || col.key; // Use dataKey if available, fallback to key
  });

  return [...rows].sort((a, b) => {
    for (const sortItem of sortState) {
      const { key, direction } = sortItem;
      const columnType = columnTypes[key] || 'text';
      const dataKey = columnDataKeys[key] || key; // Get actual field name to access
      
      let comparison = 0;
      
      if (columnType === 'number') {
        comparison = numberCmp(a[dataKey], b[dataKey]);
      } else {
        comparison = localeTextCmp(a[dataKey], b[dataKey]);
      }
      
      if (comparison !== 0) {
        return direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
};

/**
 * Get next sort direction for column toggle
 * @param {string} currentDirection - Current direction ('asc'|'desc'|null)
 * @returns {string|null} Next direction
 */
export const getNextSortDirection = (currentDirection) => {
  switch (currentDirection) {
    case null:
    case undefined:
      return 'asc';
    case 'asc':
      return 'desc';
    case 'desc':
      return null; // Reset to default
    default:
      return 'asc';
  }
};

/**
 * Update sort state when column header is clicked
 * @param {Array} currentSortState - Current sort state
 * @param {string} columnKey - Column key that was clicked
 * @param {Array} defaultSort - Default sort configuration
 * @returns {Array} New sort state
 */
export const updateSortState = (currentSortState, columnKey, defaultSort) => {
  const currentSort = currentSortState.find(s => s.key === columnKey);
  const currentDirection = currentSort?.direction;
  const nextDirection = getNextSortDirection(currentDirection);
  
  if (nextDirection === null) {
    // Reset to default sort
    return [...defaultSort];
  }
  
  // Set new primary sort
  return [{ key: columnKey, direction: nextDirection }];
};