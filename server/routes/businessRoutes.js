const express = require('express');
const businessController = require('../controllers/businessController');

const router = express.Router();

// POST /api/business-data
router.post('/business-data', businessController.getBusinessData);

// GET /api/regenerate-headline
router.get('/regenerate-headline', businessController.regenerateHeadline);

module.exports = router;