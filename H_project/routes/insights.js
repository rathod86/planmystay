const express = require('express');
const router = express.Router();
const { fetchWeather, getSeasonalAdvice, getUpcomingEventsSample, getDevelopmentSummary } = require('../utils/insights.js');
const { asyncHandler } = require('../utils/errorHandler.js');

// GET /api/insights/weather?lat=..&lng=..
router.get('/weather', asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ 
      success: false,
      error: 'Latitude and longitude are required' 
    });
  }
  
  if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid latitude or longitude values' 
    });
  }
  
  const data = await fetchWeather(lat, lng);
  res.json({ success: true, ...data });
}));

// GET /api/insights/seasonal?lat=..&lng=..
router.get('/seasonal', asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const data = getSeasonalAdvice(lat, lng);
  res.json({ success: true, ...data });
}));

// GET /api/insights/events?place=City
router.get('/events', asyncHandler(async (req, res) => {
  const { place = 'This area' } = req.query;
  const data = getUpcomingEventsSample(place);
  res.json({ success: true, ...data });
}));

// GET /api/insights/development?status=Developing
router.get('/development', asyncHandler(async (req, res) => {
  const { status = 'Developing' } = req.query;
  const data = getDevelopmentSummary(status);
  res.json({ success: true, ...data });
}));

module.exports = router;


