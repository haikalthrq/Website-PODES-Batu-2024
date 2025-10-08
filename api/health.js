const { getPodesData } = require('./_lib/dataLoader');

/**
 * Health check endpoint
 * GET /api/health
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
    
    res.status(200).json({
      status: 'OK',
      message: 'PODES Batu API Server is running',
      timestamp: new Date().toISOString(),
      dataCount: data.length
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
};
