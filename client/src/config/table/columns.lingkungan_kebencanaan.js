/**
 * Column configuration for Lingkungan & Kebencanaan category
 */
import { BASE_COLUMNS, createColumn } from './columns.common.js';

export const LINGKUNGAN_KEBENCANAAN_COLUMNS = [
  ...BASE_COLUMNS,
  createColumn('status_tps', 'Status TPS', { type: 'text' }),
  createColumn('status_tps3r', 'Status TPS3R', { type: 'text' }),
  createColumn('kejadian_banjir', 'Kejadian Banjir', { type: 'text' }),
  createColumn('kejadian_tanah_longsor', 'Kejadian Tanah Longsor', { type: 'text' }),
  createColumn('kejadian_gempa', 'Kejadian Gempa', { type: 'text' }),
  createColumn('status_peringatan_dini', 'Status Peringatan Dini', { type: 'text' })
];