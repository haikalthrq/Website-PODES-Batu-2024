/**
 * Common utilities for table column configuration
 */

/**
 * Safely coerce a value to number, return "-" if not a valid finite number
 */
export function coerceNum(value) {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  return Number.isFinite(num) ? num : '-';
}

/**
 * Get string value or fallback to "-"
 */
export function coerceStr(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

/**
 * Base columns that are common across all categories
 */
export const BASE_COLUMNS = [
  {
    key: 'kecamatan',
    label: 'Kecamatan',
    width: 160,
    type: 'text',
    accessor: (row) => coerceStr(row.nama_kecamatan)
  },
  {
    key: 'desa',
    label: 'Desa',
    width: 220,
    type: 'text',
    accessor: (row) => coerceStr(row.nama_desa)
  }
];

/**
 * Create a standardized column config
 */
export function createColumn(key, label, options = {}) {
  const {
    width = 120,
    type = 'text',
    dataKey = key,
    isNumeric = false
  } = options;

  return {
    key,
    label,
    width,
    type: isNumeric ? 'number' : type,
    dataKey,
    accessor: isNumeric 
      ? (row) => coerceNum(row[dataKey])
      : (row) => coerceStr(row[dataKey])
  };
}