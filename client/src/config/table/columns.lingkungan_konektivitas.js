/**
 * Column configuration for Infrastruktur & Konektivitas category
 */
import { BASE_COLUMNS, createColumn } from './columns.common.js';

export const INFRASTRUKTUR_KONEKTIVITAS_COLUMNS = [
  ...BASE_COLUMNS,
  createColumn('kekuatan_sinyal', 'Kualitas Sinyal Seluler', { type: 'text' }),
  createColumn('jenis_sinyal_internet', 'Jenis Akses Internet', { type: 'text' }),
  createColumn('status_penerangan_jalan_surya', 'Penerangan Jalan Tenaga Surya', { type: 'text' }),
  createColumn('status_penerangan_jalan_utama', 'Penerangan Jalan Utama', { type: 'text' })
];