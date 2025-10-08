const { getPodesData, generateComparisonAnalysis } = require('../_lib/dataLoader');

/**
 * Compare specific villages
 * GET /api/villages/compare?ids=1,2,3
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

    const data = getPodesData();
    const comparisonData = data.filter(village => 
      villageIds.includes(village.id_desa)
    );

    if (comparisonData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No villages found',
        message: 'None of the provided IDs match existing villages'
      });
    }

    const analysis = generateComparisonAnalysis(comparisonData);

    res.status(200).json({
      success: true,
      data: comparisonData,
      count: comparisonData.length,
      requestedIds: villageIds,
      analysis: analysis
    });

  } catch (error) {
    console.error('Error in compare endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare villages',
      message: error.message
    });
  }
};
