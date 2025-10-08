const { getPodesData, calculateKPIs, getCategoryIndicators } = require('./_lib/dataLoader');

/**
 * Get all villages with optional filtering
 * GET /api/villages
 * Query params: kecamatan, indicator, category
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
    const { kecamatan, indicator, category } = req.query;

    let filteredData = [...data];

    // Filter by kecamatan
    if (kecamatan && kecamatan !== 'Semua Kecamatan') {
      filteredData = filteredData.filter(
        village => village.nama_kecamatan === kecamatan
      );
    }

    // Calculate KPIs if indicator is provided
    let kpis = null;
    if (indicator && indicator !== 'Semua') {
      kpis = calculateKPIs(filteredData, indicator);
    }

    // Prepare response
    const response = {
      success: true,
      data: filteredData,
      count: filteredData.length,
      filters: {
        kecamatan: kecamatan || 'Semua Kecamatan',
        indicator: indicator || 'Semua',
        category: category || null
      }
    };

    if (kpis) {
      response.kpis = kpis;
    }

    // Add category info if category is specified
    if (category) {
      const categoryIndicators = getCategoryIndicators();
      response.categoryInfo = {
        name: category,
        indicators: categoryIndicators[category] || {}
      };
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in villages endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch villages',
      message: error.message
    });
  }
};
