/**
 * Color palette for Lingkungan & Kebencanaan indicators
 * Provides consistent colors across pie, bar, and stacked charts
 */

export const ENVIRONMENT_PALETTES = {
  // A. Sistem Peringatan Dini
  status_peringatan_dini: {
    'Ada': '#2ecc71',              // green 500
    'Tidak Ada': '#d35400',        // orange 600
    'Tidak Terdefinisi': '#95a5a6' // grey 500 (fallback)
  },

  // B. Alat Keselamatan
  status_alat_keselamatan: {
    'Ada': '#2ecc71',              // green 500
    'Tidak Ada': '#d35400',        // orange 600
    'Tidak Terdefinisi': '#95a5a6' // grey 500 (fallback)
  },

  // C. Rambu Keselamatan
  status_rambu_evakuasi: {
    'Ada': '#2ecc71',              // green 500
    'Tidak Ada': '#d35400',        // orange 600
    'Tidak Terdefinisi': '#95a5a6' // grey 500 (fallback)
  },

  // D. Tempat Penampungan Sampah (TPS)
  status_tps: {
    'Ada': '#2ecc71',              // green 500
    'Tidak Ada': '#d35400',        // orange 600 (fallback)
    'Tidak Terdefinisi': '#95a5a6' // grey 500 (fallback)
  },

  // E. Tempat Penampungan Sampah 3R (TPS3R)
  status_tps3r: {
    'Tidak ada': '#95a5a6',               // grey 500
    'Ada, digunakan': '#2ecc71',          // green 500
    'Ada, tidak digunakan': '#f1c40f',    // yellow 500
    'Tidak Terdefinisi': '#95a5a6'        // grey 500 (fallback)
  },

  // F. Pemilahan Sampah
  status_dilakukan_pemilahan_sampah: {
    'Ada': '#2ecc71',              // green 500
    'Tidak Ada': '#95a5a6',        // grey 500
    'Tidak Terdefinisi': '#95a5a6' // grey 500
  },

  // G. Kebiasaan Pemilahan Sampah
  kebiasaan_pemilahan_sampah: {
    'Sebagian Besar Keluarga': '#1abc9c',  // teal 500
    'Semua Keluarga': '#3498db',           // blue 500
    'Sebagian Kecil Keluarga': '#9b59b6',  // purple 500
    'Tidak Terdefinisi': '#95a5a6'         // grey 500 (fallback)
  },

  // H. Partisipasi Warga Pengolahan Sampah
  warga_terlibat_olah_sampah: {
    'Ada, sebagian warga terlibat': '#1abc9c', // teal 500
    'Ada, semua warga terlibat': '#2ecc71',    // green 500 (if exists)
    'Tidak Ada': '#95a5a6',                    // grey 500 (fallback)
    'Tidak Terdefinisi': '#95a5a6'             // grey 500 (fallback)
  },

  // I. Kebiasaan Bakar Lahan
  kebiasaan_bakar_lahan: {
    'Tidak Ada': '#f1c40f',        // yellow 500
    'Ada': '#8e44ad',              // purple 600
    'Tidak Terdefinisi': '#95a5a6' // grey 500 (fallback)
  },

  // J. Pencemaran Air dari Pabrik
  sumber_pencemaran_air_dari_pabrik: {
    'Ya': '#8e44ad',               // purple 600
    'Tidak': '#2ecc71',            // green 500
    'Tidak Terdefinisi': '#95a5a6' // grey 500
  }
};

/**
 * Get color palette for a specific indicator
 * @param {string} indicatorKey - The indicator data key
 * @returns {Object} Color mapping object
 */
export const getPalette = (indicatorKey) => {
  return ENVIRONMENT_PALETTES[indicatorKey] || {
    'Ada': '#2ecc71',
    'Tidak Ada': '#d35400',
    'Tidak Terdefinisi': '#95a5a6'
  };
};

/**
 * Get color for a specific category value
 * @param {string} indicatorKey - The indicator data key
 * @param {string} categoryValue - The category value
 * @returns {string} Hex color code
 */
export const getCategoryColor = (indicatorKey, categoryValue) => {
  const palette = getPalette(indicatorKey);
  
  // Normalize empty/null values
  const normalizedValue = (!categoryValue || categoryValue === '' || categoryValue === null) 
    ? 'Tidak Terdefinisi' 
    : categoryValue;
    
  return palette[normalizedValue] || palette['Tidak Terdefinisi'] || '#95a5a6';
};

/**
 * Color series for charts (when using index-based coloring)
 */
const ENV_COLOR_SERIES = [
  '#2ecc71', // green
  '#3498db', // blue
  '#f1c40f', // yellow
  '#e67e22', // orange
  '#9b59b6', // purple
  '#1abc9c', // teal
  '#95a5a6'  // grey
];

/**
 * Get color by index for generic charts
 * Used by the adapter when building chart data
 * @param {number} index - The index in the color array
 * @returns {string} Hex color code
 */
export const getEnvColor = (index) => {
  return ENV_COLOR_SERIES[index % ENV_COLOR_SERIES.length];
};

export default ENVIRONMENT_PALETTES;