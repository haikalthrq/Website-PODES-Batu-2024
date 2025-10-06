const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');

// GET /api/villages - Get all villages with optional filtering
router.get('/', villageController.getAllVillages);

// GET /api/villages/compare - Compare specific villages
router.get('/compare', villageController.compareVillages);

// GET /api/villages/metadata - Get metadata for filters (corrected path)
router.get('/metadata', villageController.getMetadata);

module.exports = router;