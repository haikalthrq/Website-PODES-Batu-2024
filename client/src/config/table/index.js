/**
 * Central barrel export for all table column configurations
 */
import { PENDIDIKAN_COLUMNS } from './columns.pendidikan.js';
import { KESEHATAN_COLUMNS } from './columns.kesehatan.js';
import { INFRASTRUKTUR_KONEKTIVITAS_COLUMNS } from './columns.lingkungan_konektivitas.js';
import { LINGKUNGAN_KEBENCANAAN_COLUMNS } from './columns.lingkungan_kebencanaan.js';

/**
 * Get column configuration for a specific category
 */
export function getColumnsForCategory(categoryKey) {
  const normalizedKey = String(categoryKey).toLowerCase().replace(/\s+/g, '_');
  
  switch (normalizedKey) {
    case 'pendidikan':
      return PENDIDIKAN_COLUMNS;
    
    case 'kesehatan':
      return KESEHATAN_COLUMNS;
    
    case 'infrastruktur_&_konektivitas':
    case 'infrastruktur_konektivitas':
    case 'infrastruktur & konektivitas':
      return INFRASTRUKTUR_KONEKTIVITAS_COLUMNS;
    
    case 'lingkungan_&_kebencanaan':
    case 'lingkungan_kebencanaan':
    case 'lingkungan & kebencanaan':
      return LINGKUNGAN_KEBENCANAAN_COLUMNS;
    
    default:
      console.warn(`No column configuration found for category: ${categoryKey}`);
      return [];
  }
}

/**
 * Get all available category keys
 */
export function getAvailableCategories() {
  return [
    'Pendidikan',
    'Kesehatan', 
    'Infrastruktur & Konektivitas',
    'Lingkungan & Kebencanaan'
  ];
}

// Re-export utilities
export { coerceNum, coerceStr, BASE_COLUMNS, createColumn } from './columns.common.js';