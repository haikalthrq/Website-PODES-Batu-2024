// Village Controller - Handle PODES data operations

// Get category indicators mapping - Updated with complete mapping from Streamlit
const getCategoryIndicators = () => {
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
};

// Get quantitative indicators (numeric values)
const getQuantitativeIndicators = () => {
  return new Set([
    'jumlah_tk', 'jumlah_sd', 'jumlah_smp', 'jumlah_sma',
    'jumlah_rs', 'jumlah_puskesmas',
    'jumlah_bts', 'jumlah_keluarga_pengguna_kayu_bakar'
  ]);
};

// Helper function to determine if indicator is quantitative
const isQuantitativeIndicator = (indicator) => {
  return getQuantitativeIndicators().has(indicator);
};

// Calculate KPI metrics for filtered data (Enhanced version)
const calculateKPIs = (filteredData, indicator) => {
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
    
    // Find top performing village
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
    // For qualitative indicators, provide distribution
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
      total: filteredData.length,
      count: filteredData.length,
      mostCommon,
      categories: Object.keys(distribution).length
    };
  }
};

// Generate ranking data for quantitative indicators
const generateRankingData = (filteredData, indicator) => {
  if (!isQuantitativeIndicator(indicator)) return null;
  
  return filteredData
    .map(village => ({
      nama_desa: village.nama_desa,
      nama_kecamatan: village.nama_kecamatan,
      value: village[indicator] || 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10
};

// Get all villages with optional filtering
const getAllVillages = (req, res) => {
  try {
    const { kecamatan, category, indicator, desa } = req.query;
    let filteredData = [...req.podesData];

    // Filter by kecamatan
    if (kecamatan && kecamatan !== 'Semua Kecamatan') {
      filteredData = filteredData.filter(village => 
        village.nama_kecamatan === kecamatan
      );
    }

    // Filter by desa (multiple selection)
    if (desa) {
      const desaList = Array.isArray(desa) ? desa : [desa];
      if (!desaList.includes('Semua Desa/Kelurahan')) {
        filteredData = filteredData.filter(village => 
          desaList.includes(village.nama_desa)
        );
      }
    }

    // Calculate KPI metrics if indicator is specified
    let kpis = null;
    let rankingData = null;
    let chartData = null;
    
    if (indicator && indicator !== 'Semua') {
      kpis = calculateKPIs(filteredData, indicator);
      
      // Generate ranking data for quantitative indicators
      if (isQuantitativeIndicator(indicator)) {
        rankingData = generateRankingData(filteredData, indicator);
      } else {
        // For qualitative indicators, generate distribution chart data
        chartData = kpis?.distribution ? Object.keys(kpis.distribution).map(key => ({
          name: key,
          value: kpis.distribution[key],
          percentage: kpis.percentages[key]
        })) : [];
      }
    }

    res.json({
      success: true,
      data: filteredData,
      count: filteredData.length,
      filters: { kecamatan, category, indicator, desa },
      kpis: kpis,
      rankingData: rankingData,
      chartData: chartData,
      indicatorType: indicator ? (isQuantitativeIndicator(indicator) ? 'quantitative' : 'qualitative') : null
    });

  } catch (error) {
    console.error('Error in getAllVillages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch villages data',
      message: error.message
    });
  }
};

// Compare specific villages
const compareVillages = (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        error: 'Village IDs are required',
        message: 'Please provide ids parameter with comma-separated village IDs'
      });
    }

    const villageIds = ids.split(',').map(id => parseInt(id.trim()));
    
    if (villageIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 villages required for comparison',
        message: 'Please provide at least 2 village IDs'
      });
    }

    const comparisonData = req.podesData.filter(village => 
      villageIds.includes(village.id_desa)
    );

    if (comparisonData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No villages found',
        message: 'None of the provided IDs match existing villages'
      });
    }

    // Generate comparison analysis
    const analysis = generateComparisonAnalysis(comparisonData);

    res.json({
      success: true,
      data: comparisonData,
      count: comparisonData.length,
      requestedIds: villageIds,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error in compareVillages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare villages',
      message: error.message
    });
  }
};

// Get metadata for filters
const getMetadata = (req, res) => {
  try {
    const data = req.podesData;
    
    // Extract unique values for filters
    const kecamatans = [...new Set(data.map(village => village.nama_kecamatan))].sort();
    const desas = [...new Set(data.map(village => village.nama_desa))].sort();
    
    // Get category indicators
    const categoryIndicators = getCategoryIndicators();
    
    // Calculate some basic statistics
    const totalVillages = data.length;
    const totalKecamatan = kecamatans.length;

    res.json({
      success: true,
      data: {
        totalVillages,
        totalKecamatan,
        kecamatans: ['Semua Kecamatan', ...kecamatans],
        desas,
        categoryIndicators,
        categories: Object.keys(categoryIndicators),
        villages: data, // Include villages for relationship mapping
        dataFields: Object.keys(data[0] || {})
      }
    });

  } catch (error) {
    console.error('Error in getMetadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata',
      message: error.message
    });
  }
};

// Helper function to generate comparison analysis
const generateComparisonAnalysis = (villages) => {
  const categoryIndicators = getCategoryIndicators();
  const analysis = {};

  // Analyze each category
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
};

module.exports = {
  getAllVillages,
  compareVillages,
  getMetadata
};