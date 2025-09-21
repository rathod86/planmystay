const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const { asyncHandler } = require('../utils/errorHandler.js');

// Simple services landing to showcase offerings and quick filter
router.get('/', asyncHandler(async (req, res) => {
  const latest = await Listing.find().sort({_id:-1}).limit(8);
  res.render('services/index', { latest, layout: 'layouts/boilerplate' });
}));

module.exports = router;


