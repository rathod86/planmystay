const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journey.js');
const { isLoggedIn } = require('../middleware.js');
const { asyncHandler } = require('../utils/errorHandler.js');

// Public routes
router.get('/nearest', asyncHandler(journeyController.getNearestPlaces));
router.get('/search', asyncHandler(journeyController.searchPlaces));
router.get('/popular', asyncHandler(journeyController.getPopularPlaces));
router.get('/type/:type', asyncHandler(journeyController.getPlacesByType));
router.get('/:id', asyncHandler(journeyController.getPlaceDetails));
router.get('/:id/view', asyncHandler(journeyController.viewPlaceDetails));

// Protected routes (require authentication)
router.post('/', isLoggedIn, asyncHandler(journeyController.createPlace));
router.put('/:id', isLoggedIn, asyncHandler(journeyController.updatePlace));
router.delete('/:id', isLoggedIn, asyncHandler(journeyController.deletePlace));

module.exports = router;
