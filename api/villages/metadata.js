const { getPodesData, getCategoryIndicators } = require('../_lib/dataLoader');

/**
 * Get metadata for filters
 * GET /api/villages/metadata
 */
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = getPodesData();
    
    // Extract unique values for filters
    const kecamatans = [...new Set(data.map(village => village.nama_kecamatan))].sort();
    const desas = [...new Set(data.map(village => village.nama_desa))].sort();
    
    const categoryIndicators = getCategoryIndicators();
    
    const totalVillages = data.length;
    const totalKecamatan = kecamatans.length;

    res.status(200).json({
      success: true,
      data: {
        totalVillages,
        totalKecamatan,
        kecamatans: ['Semua Kecamatan', ...kecamatans],
        desas,
        categoryIndicators,
        categories: Object.keys(categoryIndicators),
        villages: data,
        dataFields: Object.keys(data[0] || {})
      }
    });

  } catch (error) {
    console.error('Error in metadata endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata',
      message: error.message
    });
  }
};
