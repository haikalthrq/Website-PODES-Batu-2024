// Icon strings for indicators (using emoji for simplicity)
const ICONS = {
  signal: '📶',
  wifi: '📶',
  lightbulb: '💡',
  tower: '📡'
};

import {
  transformForPieChart,
  transformForBarChart,
  transformForDistributionChart,
  transformForNumericChart,
  calculateCategoricalStats,
  calculateNumericStats
} from '../utils/dataTransform';

/**
 * Universal indicator configuration system
 * Defines visualization settings for all indicators across categories
 */

export const INDICATOR_CONFIGS = {
  // ==========================================
  // INFRASTRUKTUR & KONEKTIVITAS
  // ==========================================
  'kualitas_sinyal_internet': {
    key: 'kualitas_sinyal_internet',
    dataKey: 'kekuatan_sinyal',
    title: 'Kualitas Sinyal Internet',
    subtitle: 'Klik untuk membuka',
    icon: ICONS.signal,
    type: 'categorical',
    categoryMapping: {
      // No mapping needed - already string values
    },
    visualization: {
      layout: 'standard',
      charts: [
        {
          type: 'donut',
          title: 'Distribusi Kualitas Sinyal Internet',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'bar',
          title: 'Ranking Kategori',
          orientation: 'horizontal',
          colorMode: 'ranking',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'distribution',
          title: 'Distribusi per Kecamatan',
          groupBy: 'kecamatan',
          stackedKeys: ['Sangat Kuat', 'Kuat', 'Sedang', 'Lemah', 'Sangat Lemah'],
          gridSize: { xs: 12 },
          height: 350
        }
      ]
    },
    generateChartData: (data) => {
      const { categoryMapping } = INDICATOR_CONFIGS['kualitas_sinyal_internet'];
      
      return {
        charts: [
          {
            ...INDICATOR_CONFIGS['kualitas_sinyal_internet'].visualization.charts[0],
            data: transformForPieChart(data, 'kekuatan_sinyal', { categoryMapping })
          },
          {
            ...INDICATOR_CONFIGS['kualitas_sinyal_internet'].visualization.charts[1],
            data: transformForBarChart(data, 'kekuatan_sinyal', { categoryMapping, sortBy: 'value' })
          },
          {
            ...INDICATOR_CONFIGS['kualitas_sinyal_internet'].visualization.charts[2],
            data: transformForDistributionChart(data, 'kekuatan_sinyal', 'nama_kecamatan', { categoryMapping })
          }
        ],
        stats: calculateCategoricalStats(data, 'kekuatan_sinyal', { categoryMapping })
      };
    }
  },

  'jenis_akses_internet': {
    key: 'jenis_akses_internet',
    dataKey: 'jenis_sinyal_internet',
    title: 'Jenis Akses Internet',
    subtitle: 'Klik untuk membuka',
    icon: ICONS.wifi,
    type: 'categorical',
    categoryMapping: {
      // No mapping needed - already string values
    },
    visualization: {
      layout: 'standard',
      charts: [
        {
          type: 'donut',
          title: 'Distribusi Jenis Sinyal Internet',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'bar',
          title: 'Ranking Kategori',
          orientation: 'horizontal',
          colorMode: 'ranking',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'distribution',
          title: 'Distribusi per Kecamatan',
          groupBy: 'kecamatan',
          stackedKeys: ['5G/4G/LTE', '3G', 'Broadband/WiFi', 'Satelit'],
          gridSize: { xs: 12 },
          height: 350
        }
      ]
    },
    generateChartData: (data) => {
      const { categoryMapping } = INDICATOR_CONFIGS['jenis_akses_internet'];
      
      return {
        charts: [
          {
            ...INDICATOR_CONFIGS['jenis_akses_internet'].visualization.charts[0],
            data: transformForPieChart(data, 'jenis_sinyal_internet', { categoryMapping })
          },
          {
            ...INDICATOR_CONFIGS['jenis_akses_internet'].visualization.charts[1],
            data: transformForBarChart(data, 'jenis_sinyal_internet', { categoryMapping, sortBy: 'value' })
          },
          {
            ...INDICATOR_CONFIGS['jenis_akses_internet'].visualization.charts[2],
            data: transformForDistributionChart(data, 'jenis_sinyal_internet', 'nama_kecamatan', { categoryMapping })
          }
        ],
        stats: calculateCategoricalStats(data, 'jenis_sinyal_internet', { categoryMapping })
      };
    }
  },

  'penerangan_jalan_tenaga_surya': {
    key: 'penerangan_jalan_tenaga_surya',
    dataKey: 'status_penerangan_jalan_surya',
    title: 'Penerangan Jalan Tenaga Surya',
    subtitle: 'Klik untuk membuka',
    icon: ICONS.lightbulb,
    type: 'categorical',
    categoryMapping: {
      // No mapping needed - already string values
    },
    visualization: {
      layout: 'standard',
      charts: [
        {
          type: 'donut',
          title: 'Distribusi Penerangan Jalan Tenaga Surya',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'bar',
          title: 'Ranking Kategori',
          orientation: 'horizontal',
          colorMode: 'ranking',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'distribution',
          title: 'Distribusi per Kecamatan',
          groupBy: 'kecamatan',
          stackedKeys: ['Ada', 'Tidak Ada'],
          gridSize: { xs: 12 },
          height: 350
        }
      ]
    },
    generateChartData: (data) => {
      const { categoryMapping } = INDICATOR_CONFIGS['penerangan_jalan_tenaga_surya'];
      
      return {
        charts: [
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_tenaga_surya'].visualization.charts[0],
            data: transformForPieChart(data, 'status_penerangan_jalan_surya', { categoryMapping })
          },
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_tenaga_surya'].visualization.charts[1],
            data: transformForBarChart(data, 'status_penerangan_jalan_surya', { categoryMapping, sortBy: 'value' })
          },
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_tenaga_surya'].visualization.charts[2],
            data: transformForDistributionChart(data, 'status_penerangan_jalan_surya', 'nama_kecamatan', { categoryMapping })
          }
        ],
        stats: calculateCategoricalStats(data, 'status_penerangan_jalan_surya', { categoryMapping })
      };
    }
  },

  'penerangan_jalan_utama': {
    key: 'penerangan_jalan_utama',
    dataKey: 'status_penerangan_jalan_utama',
    title: 'Penerangan Jalan Utama',
    subtitle: 'Klik untuk membuka',
    icon: ICONS.lightbulb,
    type: 'categorical',
    categoryMapping: {
      // No mapping needed - already string values
    },
    visualization: {
      layout: 'standard',
      charts: [
        {
          type: 'donut',
          title: 'Distribusi Penerangan Jalan Utama',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'bar',
          title: 'Ranking Kategori',
          orientation: 'horizontal',
          colorMode: 'ranking',
          gridSize: { xs: 12, md: 6 },
          height: 300
        },
        {
          type: 'distribution',
          title: 'Distribusi per Kecamatan',
          groupBy: 'kecamatan',
          stackedKeys: ['Ada, sebagian besar', 'Ada, sebagian kecil', 'Tidak Ada'],
          gridSize: { xs: 12 },
          height: 350
        }
      ]
    },
    generateChartData: (data) => {
      const { categoryMapping } = INDICATOR_CONFIGS['penerangan_jalan_utama'];
      
      return {
        charts: [
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_utama'].visualization.charts[0],
            data: transformForPieChart(data, 'status_penerangan_jalan_utama', { categoryMapping })
          },
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_utama'].visualization.charts[1],
            data: transformForBarChart(data, 'status_penerangan_jalan_utama', { categoryMapping, sortBy: 'value' })
          },
          {
            ...INDICATOR_CONFIGS['penerangan_jalan_utama'].visualization.charts[2],
            data: transformForDistributionChart(data, 'status_penerangan_jalan_utama', 'nama_kecamatan', { categoryMapping })
          }
        ],
        stats: calculateCategoricalStats(data, 'status_penerangan_jalan_utama', { categoryMapping })
      };
    }
  },

  'bts_di_wilayah_desa': {
    key: 'bts_di_wilayah_desa',
    dataKey: 'jumlah_bts',
    title: 'BTS di Wilayah Desa',
    subtitle: 'Klik untuk membuka',
    icon: ICONS.tower,
    type: 'numeric',
    visualization: {
      layout: 'standard',
      charts: [
        {
          type: 'bar',
          title: 'Distribusi Jumlah BTS per Desa',
          orientation: 'vertical',
          colorMode: 'gradient',
          gridSize: { xs: 12, md: 8 },
          height: 350
        },
        {
          type: 'distribution',
          title: 'Distribusi per Kecamatan',
          groupBy: 'kecamatan',
          gridSize: { xs: 12, md: 4 },
          height: 350
        }
      ]
    },
    generateChartData: (data) => {
      const { histogramData, stats } = transformForNumericChart(data, 'jumlah_bts', { groupBy: 'nama_kecamatan' });
      
      // Create value distribution for first chart
      const valueDistribution = transformForPieChart(data, 'jumlah_bts', { 
        filterEmpty: true,
        sortByValue: true,
        maxCategories: 10
      });

      return {
        charts: [
          {
            ...INDICATOR_CONFIGS['bts_di_wilayah_desa'].visualization.charts[0],
            data: valueDistribution
          },
          {
            ...INDICATOR_CONFIGS['bts_di_wilayah_desa'].visualization.charts[1],
            data: histogramData
          }
        ],
        stats: calculateNumericStats(data, 'jumlah_bts', { includeZeros: true })
      };
    }
  }
};

/**
 * Get indicator configuration by key
 * @param {string} indicatorKey - The indicator key
 * @returns {Object|null} Configuration object or null if not found
 */
export const getIndicatorConfig = (indicatorKey) => {
  return INDICATOR_CONFIGS[indicatorKey] || null;
};

/**
 * Get all indicator configurations for a category
 * @param {string} category - Category name
 * @returns {Array} Array of indicator configurations
 */
export const getIndicatorsForCategory = (category) => {
  const categoryMappings = {
    'infrastruktur_konektivitas': [
      'kualitas_sinyal_internet',
      'jenis_akses_internet', 
      'penerangan_jalan_tenaga_surya',
      'penerangan_jalan_utama',
      'bts_di_wilayah_desa'
    ],
    // Add other categories as needed
    'lingkungan_kebencanaan': [],
    'pendidikan': [],
    'kesehatan': []
  };

  const indicatorKeys = categoryMappings[category] || [];
  return indicatorKeys.map(key => INDICATOR_CONFIGS[key]).filter(Boolean);
};

/**
 * Generate visualization data for an indicator
 * @param {string} indicatorKey - The indicator key
 * @param {Array} data - Raw village data
 * @returns {Object} Visualization configuration with data
 */
export const generateIndicatorVisualization = (indicatorKey, data) => {
  const config = getIndicatorConfig(indicatorKey);
  
  if (!config || !config.generateChartData) {
    return {
      charts: [],
      stats: {},
      layout: 'standard'
    };
  }

  try {
    const visualizationData = config.generateChartData(data);
    return {
      ...visualizationData,
      layout: config.visualization.layout
    };
  } catch (error) {
    console.error(`Error generating visualization for ${indicatorKey}:`, error);
    return {
      charts: [],
      stats: {},
      layout: 'standard'
    };
  }
};

/**
 * Check if an indicator is available/configured
 * @param {string} indicatorKey - The indicator key
 * @returns {boolean} True if indicator is configured
 */
export const isIndicatorAvailable = (indicatorKey) => {
  return !!INDICATOR_CONFIGS[indicatorKey];
};

/**
 * Get all available indicator keys
 * @returns {Array} Array of all indicator keys
 */
export const getAllIndicatorKeys = () => {
  return Object.keys(INDICATOR_CONFIGS);
};