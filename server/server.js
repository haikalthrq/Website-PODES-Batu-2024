const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

// Import routes
const villageRoutes = require('./routes/villages');

const app = express();
const PORT = process.env.PORT || 5001;

// Global variable to store PODES data in memory
let podesData = [];

// Load PODES data into memory on server start
function loadPodesData() {
  try {
    const dataPath = path.join(__dirname, 'data', 'data_podes_2024.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    podesData = JSON.parse(rawData);
    console.log(`✅ PODES data loaded successfully: ${podesData.length} villages`);
  } catch (error) {
    console.error('❌ Error loading PODES data:', error.message);
    process.exit(1);
  }
}

// Middleware
app.use(helmet()); // Security headers

// Configure CORS to accept requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development, specific in production
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Enable CORS with options

app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make podesData available to all routes
app.use((req, res, next) => {
  req.podesData = podesData;
  next();
});

// Routes
app.use('/api/villages', villageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PODES Batu API Server is running',
    timestamp: new Date().toISOString(),
    dataCount: podesData.length
  });
});

// Serve static files from React build (for production)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  console.log('✅ Serving static frontend from:', clientBuildPath);
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Development mode - API only
  console.log('⚠️ No frontend build found. API-only mode.');
  
  // Root endpoint - API info
  app.get('/', (req, res) => {
    res.json({
      message: 'PODES Batu 2024 Dashboard API',
      version: '1.0.0',
      endpoints: [
        'GET /api/health - Health check',
        'GET /api/villages - Get all villages with optional filtering',
        'GET /api/villages/compare - Compare specific villages',
        'GET /api/metadata - Get metadata for filters'
      ]
    });
  });

  // 404 handler for API-only mode
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`
    });
  });
}

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

// Start server
function startServer() {
  loadPodesData();
  
  app.listen(PORT, () => {
    console.log(`🚀 PODES Batu Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  });
}

startServer();

module.exports = app;