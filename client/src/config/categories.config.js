// Generic, config-driven categories configuration for "Ringkasan Seluruh Indikator"
// Data-driven approach for consistent UI across all categories

// Import individual indicator configurations
import PENDIDIKAN_INDICATORS from './indicators/pendidikan.js';
import KESEHATAN_INDICATORS from './indicators/kesehatan.js';
import LINGKUNGAN_KONEKTIVITAS_INDICATORS from './indicators/lingkungan_konektivitas.js';
import LINGKUNGAN_KEBENCANAAN_INDICATORS from './indicators/lingkungan_kebencanaan.js';

/**
 * Color tokens for charts following existing design system
 */
export const CHART_COLORS = {
  teal: '#14b8a6',
  magenta: '#d946ef', 
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  indigo: '#6366f1',
  cyan: '#06b6d4'
};

/**
 * Category configuration structure
 * Each category defines its quantitative indicators for the accordion summary
 */
export const CATEGORIES_CONFIG = {
  pendidikan: {
    key: 'Pendidikan',
    title: 'Pendidikan',
    defaultOpenIndicator: 'tk',
    indicators: [
      {
        key: 'tk',
        label: 'Jumlah TK',
        dataKey: 'jumlah_tk',
        accessor: (row) => row.jumlah_tk || 0,
        colorTokens: {
          ranking: CHART_COLORS.teal,
          distribusi: CHART_COLORS.magenta
        },
        icon: '🎓'
      },
      {
        key: 'sd',
        label: 'Jumlah SD',
        dataKey: 'jumlah_sd',
        accessor: (row) => row.jumlah_sd || 0,
        colorTokens: {
          ranking: CHART_COLORS.teal,
          distribusi: CHART_COLORS.purple
        },
        icon: '📚'
      },
      {
        key: 'smp',
        label: 'Jumlah SMP',
        dataKey: 'jumlah_smp',
        accessor: (row) => row.jumlah_smp || 0,
        colorTokens: {
          ranking: CHART_COLORS.teal,
          distribusi: CHART_COLORS.blue
        },
        icon: '🏫'
      },
      {
        key: 'sma',
        label: 'Jumlah SMA',
        dataKey: 'jumlah_sma',
        accessor: (row) => row.jumlah_sma || 0,
        colorTokens: {
          ranking: CHART_COLORS.teal,
          distribusi: CHART_COLORS.indigo
        },
        icon: '🎯'
      }
    ]
  },

  kesehatan: {
    key: 'Kesehatan',
    title: 'Kesehatan',
    defaultOpenIndicator: 'rs',
    indicators: [
      {
        key: 'rs',
        label: 'Jumlah Rumah Sakit',
        dataKey: 'jumlah_rs',
        accessor: (row) => row.jumlah_rs || 0,
        colorTokens: {
          ranking: CHART_COLORS.green,
          distribusi: CHART_COLORS.red
        },
        icon: '🏥'
      },
      {
        key: 'puskesmas',
        label: 'Jumlah Puskesmas',
        dataKey: 'jumlah_puskesmas',
        accessor: (row) => row.jumlah_puskesmas || 0,
        colorTokens: {
          ranking: CHART_COLORS.green,
          distribusi: CHART_COLORS.orange
        },
        icon: '⚕️'
      }
    ]
  },



  lingkungan: {
    key: 'Lingkungan',
    title: 'Lingkungan',
    defaultOpenIndicator: 'keluarga_kayu_bakar',
    indicators: [
      {
        key: 'keluarga_kayu_bakar',
        label: 'Jumlah Keluarga Pengguna Kayu Bakar',
        dataKey: 'jumlah_keluarga_pengguna_kayu_bakar',
        accessor: (row) => row.jumlah_keluarga_pengguna_kayu_bakar || 0,
        colorTokens: {
          ranking: CHART_COLORS.orange,
          distribusi: CHART_COLORS.red
        },
        icon: '🔥'
      }
    ]
  },

  lingkungan_konektivitas: {
    key: 'Infrastruktur & Konektivitas',
    title: 'Infrastruktur & Konektivitas', 
    defaultOpenIndicator: 'kualitas_sinyal_internet',
    indicators: LINGKUNGAN_KONEKTIVITAS_INDICATORS.map(indicator => ({
      ...indicator,
      colorTokens: {
        ranking: CHART_COLORS.blue,
        distribusi: CHART_COLORS.cyan
      },
      accessor: (row) => row[indicator.dataKey] || '-'
    }))
  },

  lingkungan_kebencanaan: {
    key: 'Lingkungan & Kebencanaan',
    title: 'Lingkungan & Kebencanaan',
    defaultOpenIndicator: 'sistem_peringatan_dini', 
    indicators: LINGKUNGAN_KEBENCANAAN_INDICATORS.map(indicator => ({
      ...indicator,
      colorTokens: {
        ranking: CHART_COLORS.red,
        distribusi: CHART_COLORS.orange
      },
      accessor: (row) => row[indicator.dataKey] || '-'
    }))
  }
};

/**
 * Comparison-specific configuration for multi-village comparison feature
 * Maps categories to their comparison-enabled indicators with proper accessors
 */
export const COMPARISON_CONFIG = {
  pendidikan: {
    key: 'pendidikan',
    title: 'Pendidikan',
    icon: '📚',
    indicators: [
      {
        key: 'tk',
        label: 'Jumlah TK',
        dataKey: 'jumlah_tk',
        accessor: (row) => row.jumlah_tk || 0,
        color: CHART_COLORS.teal
      },
      {
        key: 'sd',
        label: 'Jumlah SD',
        dataKey: 'jumlah_sd',
        accessor: (row) => row.jumlah_sd || 0,
        color: CHART_COLORS.purple
      },
      {
        key: 'smp',
        label: 'Jumlah SMP',
        dataKey: 'jumlah_smp',
        accessor: (row) => row.jumlah_smp || 0,
        color: CHART_COLORS.blue
      },
      {
        key: 'sma',
        label: 'Jumlah SMA',
        dataKey: 'jumlah_sma',
        accessor: (row) => row.jumlah_sma || 0,
        color: CHART_COLORS.indigo
      }
    ]
  },
  kesehatan: {
    key: 'kesehatan',
    title: 'Kesehatan',
    icon: '🏥',
    indicators: [
      {
        key: 'rs',
        label: 'Jumlah Rumah Sakit',
        dataKey: 'jumlah_rs',
        accessor: (row) => row.jumlah_rs || 0,
        color: CHART_COLORS.red
      },
      {
        key: 'puskesmas',
        label: 'Puskesmas',
        dataKey: 'jumlah_puskesmas',
        accessor: (row) => row.jumlah_puskesmas || 0,
        color: CHART_COLORS.green
      }
    ]
  },
  lingkungan_konektivitas: {
    key: 'lingkungan_konektivitas',
    title: 'Infrastruktur & Konektivitas',
    icon: '🌐',
    // Special handling for qualitative (text-based) data
    hasQualitativeData: true,
    comparisonMode: 'table-only', // Don't show charts, only comparison table
    indicators: [
      {
        key: 'kualitas_sinyal_seluler',
        label: 'Kualitas Sinyal Seluler',
        dataKey: 'kekuatan_sinyal',
        type: 'qualitative',
        accessor: (row) => row.kekuatan_sinyal || '-',
        color: CHART_COLORS.blue
      },
      {
        key: 'jenis_akses_internet',
        label: 'Jenis Akses Internet',
        dataKey: 'jenis_sinyal_internet',
        type: 'qualitative',
        accessor: (row) => row.jenis_sinyal_internet || '-',
        color: CHART_COLORS.cyan
      },
      {
        key: 'penerangan_jalan_tenaga_surya',
        label: 'Penerangan Jalan Tenaga Surya',
        dataKey: 'status_penerangan_jalan_surya',
        type: 'qualitative',
        accessor: (row) => row.status_penerangan_jalan_surya || '-',
        color: CHART_COLORS.orange
      },
      {
        key: 'penerangan_jalan_utama',
        label: 'Penerangan Jalan Utama',
        dataKey: 'status_penerangan_jalan_utama',
        type: 'qualitative',
        accessor: (row) => row.status_penerangan_jalan_utama || '-',
        color: CHART_COLORS.green
      }
    ]
  },

  lingkungan: {
    key: 'lingkungan',
    title: 'Lingkungan & Kebencanaan',
    icon: '🌿',
    // Special handling for qualitative (text-based) data - mirrors Infrastructure pattern
    hasQualitativeData: true,
    comparisonMode: 'table-only', // Don't show charts, only comparison table
    indicators: [
      {
        key: 'sistem_peringatan_dini',
        label: 'Sistem Peringatan Dini',
        dataKey: 'status_peringatan_dini',
        type: 'qualitative',
        accessor: (row) => row.status_peringatan_dini || '-',
        color: CHART_COLORS.red
      },
      {
        key: 'alat_keselamatan',
        label: 'Alat Keselamatan',
        dataKey: 'status_alat_keselamatan',
        type: 'qualitative',
        accessor: (row) => row.status_alat_keselamatan || '-',
        color: CHART_COLORS.orange
      },
      {
        key: 'rambu_keselamatan',
        label: 'Rambu Keselamatan',
        dataKey: 'status_rambu_evakuasi',
        type: 'qualitative',
        accessor: (row) => row.status_rambu_evakuasi || '-',
        color: CHART_COLORS.yellow
      },
      {
        key: 'tempat_pembuangan_sampah',
        label: 'Tempat Penampungan Sampah (TPS)',
        dataKey: 'status_tps',
        type: 'qualitative',
        accessor: (row) => row.status_tps || '-',
        color: CHART_COLORS.green
      },
      {
        key: 'tempat_pengelolaan_sampah_3r',
        label: 'Tempat Penampungan Sampah 3R (TPS3R)',
        dataKey: 'status_tps3r',
        type: 'qualitative',
        accessor: (row) => row.status_tps3r || '-',
        color: CHART_COLORS.teal
      },
      {
        key: 'pemilahan_sampah',
        label: 'Pemilahan Sampah',
        dataKey: 'status_dilakukan_pemilahan_sampah',
        type: 'qualitative',
        accessor: (row) => row.status_dilakukan_pemilahan_sampah || '-',
        color: CHART_COLORS.cyan
      },
      {
        key: 'kebiasaan_pemilahan_sampah',
        label: 'Kebiasaan Pemilahan Sampah',
        dataKey: 'kebiasaan_pemilahan_sampah',
        type: 'qualitative',
        accessor: (row) => row.kebiasaan_pemilahan_sampah || '-',
        color: CHART_COLORS.blue
      },
      {
        key: 'partisipasi_warga_pengolahan_sampah',
        label: 'Partisipasi Warga Pengolahan Sampah',
        dataKey: 'warga_terlibat_olah_sampah',
        type: 'qualitative',
        accessor: (row) => row.warga_terlibat_olah_sampah || '-',
        color: CHART_COLORS.indigo
      },
      {
        key: 'kebiasaan_bakar_lahan',
        label: 'Kebiasaan Bakar Lahan',
        dataKey: 'kebiasaan_bakar_lahan',
        type: 'qualitative',
        accessor: (row) => row.kebiasaan_bakar_lahan || '-',
        color: CHART_COLORS.purple
      },
      {
        key: 'pencemaran_air_pabrik',
        label: 'Pencemaran Air dari Pabrik',
        dataKey: 'sumber_pencemaran_air_dari_pabrik',
        type: 'qualitative',
        accessor: (row) => row.sumber_pencemaran_air_dari_pabrik || '-',
        color: CHART_COLORS.pink
      }
    ]
  }
};

/**
 * Helper function to get category configuration by key
 * @param {string} categoryKey - The category key (e.g., 'Pendidikan', 'Kesehatan')
 * @returns {object|null} Category configuration or null if not found
 */
export const getCategoryConfig = (categoryKey) => {
  // Handle both formats: 'Pendidikan' and 'pendidikan'
  const normalizedKey = categoryKey.toLowerCase();
  
  // Special mapping for category names that don't match exactly
  const categoryMapping = {
    'infrastruktur & konektivitas': 'lingkungan_konektivitas',
    'lingkungan & kebencanaan': 'lingkungan_kebencanaan',
    'pendidikan': 'pendidikan',
    'kesehatan': 'kesehatan'
  };
  
  // Try direct key lookup with mapping
  const mappedKey = categoryMapping[normalizedKey] || normalizedKey;
  if (CATEGORIES_CONFIG[mappedKey]) {
    return CATEGORIES_CONFIG[mappedKey];
  }
  
  // Direct key lookup without mapping
  if (CATEGORIES_CONFIG[normalizedKey]) {
    return CATEGORIES_CONFIG[normalizedKey];
  }
  
  // Fallback: search by category key field
  const configEntry = Object.values(CATEGORIES_CONFIG).find(
    config => config.key === categoryKey
  );
  
  return configEntry || null;
};

/**
 * Helper function to get comparison configuration by category key
 * @param {string} categoryKey - The category key (e.g., 'pendidikan', 'kesehatan')
 * @returns {object|null} Comparison configuration or null if not found
 */
export const getComparisonConfig = (categoryKey) => {
  const normalizedKey = categoryKey.toLowerCase();
  
  // Special mapping for comparison config
  const comparisonMapping = {
    'infrastruktur & konektivitas': 'lingkungan_konektivitas',
    'infrastruktur': 'lingkungan_konektivitas',  // Map to the same config
    'lingkungan & kebencanaan': 'lingkungan'
  };
  
  // Try mapping first
  const mappedKey = comparisonMapping[normalizedKey] || normalizedKey;
  if (COMPARISON_CONFIG[mappedKey]) {
    return COMPARISON_CONFIG[mappedKey];
  }
  
  // Direct lookup
  return COMPARISON_CONFIG[normalizedKey] || null;
};

/**
 * Get all available category keys
 * @returns {string[]} Array of category keys
 */
export const getCategoryKeys = () => {
  return Object.values(CATEGORIES_CONFIG).map(config => config.key);
};

/**
 * Check if a category has quantitative indicators for summary
 * @param {string} categoryKey - The category key
 * @returns {boolean} True if category has indicators
 */
export const hasQuantitativeIndicators = (categoryKey) => {
  const config = getCategoryConfig(categoryKey);
  return config && config.indicators && config.indicators.length > 0;
};

/**
 * Get indicators mapping for backward compatibility with existing code
 * @param {string} categoryKey - The category key
 * @returns {object} Object mapping dataKey to label
 */
export const getIndicatorsMapping = (categoryKey) => {
  const config = getCategoryConfig(categoryKey);
  if (!config) return {};
  
  const mapping = {};
  config.indicators.forEach(indicator => {
    mapping[indicator.dataKey] = indicator.label;
  });
  return mapping;
};

export default CATEGORIES_CONFIG;