/**
 * Column configuration for Pendidikan category
 */
import { BASE_COLUMNS, createColumn } from './columns.common.js';

export const PENDIDIKAN_COLUMNS = [
  ...BASE_COLUMNS,
  createColumn('jumlah_tk', 'Jumlah TK', { isNumeric: true }),
  createColumn('jumlah_sd', 'Jumlah SD', { isNumeric: true }),
  createColumn('jumlah_smp', 'Jumlah SMP', { isNumeric: true }),
  createColumn('jumlah_sma', 'Jumlah SMA', { isNumeric: true })
];