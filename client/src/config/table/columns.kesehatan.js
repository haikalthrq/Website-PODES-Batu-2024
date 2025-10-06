/**
 * Column configuration for Kesehatan category
 */
import { BASE_COLUMNS, createColumn } from './columns.common.js';

export const KESEHATAN_COLUMNS = [
  ...BASE_COLUMNS,
  createColumn('jumlah_puskesmas', 'Jumlah Puskesmas', { isNumeric: true }),
  createColumn('jumlah_rs', 'Jumlah Rumah Sakit', { isNumeric: true })
];