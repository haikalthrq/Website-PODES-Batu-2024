const fs = require('fs');
const path = require('path');

let podesData = null;

/**
 * Load PODES data from JSON file
 * This function is used by all serverless API functions
 * Data is cached in memory during cold starts
 */
function getPodesData() {
  if (podesData !== null) {
    return podesData;
  }

  try {
    // Try multiple path strategies for different environments
    const possiblePaths = [
      // Vercel serverless environment (from /var/task)
      path.join(process.cwd(), 'server/data/data_podes_2024.json'),
      // Relative from api/_lib directory
      path.join(__dirname, '../../server/data/data_podes_2024.json'),
      // Alternative relative path
      path.join(__dirname, '../../../server/data/data_podes_2024.json'),
    ];

    let rawData = null;
    let usedPath = null;

    for (const dataPath of possiblePaths) {
      try {
        if (fs.existsSync(dataPath)) {
          rawData = fs.readFileSync(dataPath, 'utf8');
          usedPath = dataPath;
          break;
        }
      } catch (err) {
        console.log(`Path not found: ${dataPath}`);
        continue;
      }
    }

    if (!rawData) {
      console.error('❌ Could not find data file in any of the expected locations');
      console.error('Tried paths:', possiblePaths);
      console.error('Current working directory:', process.cwd());
      console.error('__dirname:', __dirname);
      throw new Error('Data file not found');
    }

    podesData = JSON.parse(rawData);
    console.log(`✅ PODES data loaded from: ${usedPath}`);
    console.log(`✅ Villages count: ${podesData.length}`);
    return podesData;
  } catch (error) {
    console.error('❌ Error loading PODES data:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Failed to load PODES data: ' + error.message);
  }
}

/**
 * Get category indicators mapping
 */
function getCategoryIndicators() {
  return {
    "Pendidikan": {
      "jumlah_tk": "Jumlah TK",
      "jumlah_sd": "Jumlah SD", 
      "jumlah_smp": "Jumlah SMP",
      "jumlah_sma": "Jumlah SMA"
    },
    "Kesehatan": {
      "jumlah_rs": "Jumlah Rumah Sakit",
      "jumlah_puskesmas": "Jumlah Puskesmas"
    },
    "Infrastruktur & Konektivitas": {
      "kekuatan_sinyal": "Kualitas Sinyal Internet",
      "jenis_sinyal_internet": "Jenis Sinyal Internet",
      "status_penerangan_jalan_surya": "Penerangan Jalan Tenaga Surya",
      "status_penerangan_jalan_utama": "Penerangan Jalan Utama"
    },
    "Lingkungan & Kebencanaan": {
      "status_peringatan_dini": "Sistem Peringatan Dini",
      "status_alat_keselamatan": "Alat Keselamatan",
      "status_rambu_evakuasi": "Rambu Keselamatan",
      "status_tps": "Tempat Penampungan Sampah (TPS)",
      "status_tps3r": "Tempat Penampungan Sampah 3R (TPS3R)",
      "status_dilakukan_pemilahan_sampah": "Pemilahan Sampah",
      "kebiasaan_pemilahan_sampah": "Kebiasaan Pemilahan Sampah",
      "warga_terlibat_olah_sampah": "Partisipasi Warga Pengolahan Sampah",
      "kebiasaan_bakar_lahan": "Kebiasaan Bakar Lahan"
    }
  };
}

/**
 * Get quantitative indicators
 */
function getQuantitativeIndicators() {
  return new Set([
    'jumlah_tk', 'jumlah_sd', 'jumlah_smp', 'jumlah_sma',
    'jumlah_rs', 'jumlah_puskesmas',
    'jumlah_bts', 'jumlah_keluarga_pengguna_kayu_bakar'
  ]);
}

/**
 * Check if indicator is quantitative
 */
function isQuantitativeIndicator(indicator) {
  return getQuantitativeIndicators().has(indicator);
}

/**
 * Calculate KPI metrics for filtered data
 */
function calculateKPIs(filteredData, indicator) {
  if (!filteredData || filteredData.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      min: 0,
      count: 0
    };
  }

  if (isQuantitativeIndicator(indicator)) {
    const values = filteredData.map(village => village[indicator] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const average = total / values.length;
    
    const topVillage = filteredData.find(village => (village[indicator] || 0) === max);
    
    return {
      type: 'quantitative',
      total,
      average: Math.round(average * 100) / 100,
      max,
      min,
      count: filteredData.length,
      topVillage: topVillage ? {
        name: topVillage.nama_desa,
        kecamatan: topVillage.nama_kecamatan,
        value: max
      } : null
    };
  } else {
    const distribution = {};
    filteredData.forEach(village => {
      const value = village[indicator] || 'Tidak Diketahui';
      distribution[value] = (distribution[value] || 0) + 1;
    });
    
    const totalValid = filteredData.length;
    const percentages = {};
    Object.keys(distribution).forEach(key => {
      percentages[key] = Math.round((distribution[key] / totalValid) * 100 * 100) / 100;
    });
    
    const mostCommon = Object.keys(distribution).reduce((a, b) => 
      distribution[a] > distribution[b] ? a : b
    );
    
    return {
      type: 'qualitative',
      distribution,
      percentages,
      mostCommon,
      mostCommonCount: distribution[mostCommon],
      count: totalValid
    };
  }
}

/**
 * Generate comparison analysis
 */
function generateComparisonAnalysis(villages) {
  const categoryIndicators = getCategoryIndicators();
  const analysis = {};

  Object.keys(categoryIndicators).forEach(category => {
    const indicators = categoryIndicators[category];
    analysis[category] = {};

    Object.keys(indicators).forEach(indicator => {
      const values = villages.map(village => ({
        desa: village.nama_desa,
        kecamatan: village.nama_kecamatan,
        value: village[indicator]
      })).filter(item => item.value !== undefined && item.value !== null);

      if (values.length > 0) {
        analysis[category][indicator] = {
          label: indicators[indicator],
          values: values,
          summary: calculateKPIs(villages, indicator)
        };
      }
    });
  });

  return analysis;
}

module.exports = {
  getPodesData,
  getCategoryIndicators,
  getQuantitativeIndicators,
  isQuantitativeIndicator,
  calculateKPIs,
  generateComparisonAnalysis
};
