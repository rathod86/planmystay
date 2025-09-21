const Journey = require('../models/journey.js');
const wrapAsync = require('../utils/wrapAsync.js');

// Get nearest places based on user location
module.exports.getNearestPlaces = wrapAsync(async (req, res) => {
    const { latitude, longitude, type, radius = 50 } = req.query;
    
    if (!latitude || !longitude) {
        return res.status(400).json({ 
            success: false,
            error: 'Latitude and longitude are required' 
        });
    }
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const maxDistance = parseInt(radius) * 1000; // Convert km to meters
    
    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid latitude or longitude values'
        });
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
            success: false,
            error: 'Invalid coordinate range. Latitude must be between -90 and 90, longitude between -180 and 180'
        });
    }
    
    // Build filter
    const filter = { isActive: true };
    
    if (type) {
        filter.type = type;
    }
    
    let places;
    try {
        places = await Journey.find({
                ...filter,
                'location.geo': {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lng, lat] },
                        $maxDistance: maxDistance
                    }
                }
            })
            .limit(20)
            .sort({ 'rating.average': -1 })
            .populate('reviews', 'rating comment author')
            .populate('owner', 'username email');
    } catch (error) {
        console.error('Geospatial query error:', error);
        // Fallback to regular query if geospatial fails
        places = await Journey.find(filter)
            .limit(20)
            .sort({ 'rating.average': -1 })
            .populate('reviews', 'rating comment author')
            .populate('owner', 'username email');
    }
    
    res.json({
        success: true,
        count: places.length,
        places: places
    });
});

// Search places by text query
module.exports.searchPlaces = wrapAsync(async (req, res) => {
    const { q, type, minPrice, maxPrice, capacity, amenities } = req.query;
    
    // Validate price range
    if (minPrice && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid minimum price. Must be a positive number.'
        });
    }
    
    if (maxPrice && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid maximum price. Must be a positive number.'
        });
    }
    
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        return res.status(400).json({
            success: false,
            error: 'Minimum price cannot be greater than maximum price.'
        });
    }
    
    // Validate capacity
    if (capacity && (isNaN(parseInt(capacity)) || parseInt(capacity) < 1)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid capacity. Must be a positive number.'
        });
    }
    
    const filter = { isActive: true };
    
    // Text search - use regex instead of $text for better compatibility
    if (q) {
        filter.$or = [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'location.name': { $regex: q, $options: 'i' } }
        ];
    }
    
    // Type filter
    if (type) {
        filter.type = type;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
        filter['pricing.basePrice'] = {};
        if (minPrice) filter['pricing.basePrice'].$gte = parseInt(minPrice);
        if (maxPrice) filter['pricing.basePrice'].$lte = parseInt(maxPrice);
    }
    
    // Capacity filter
    if (capacity) {
        filter['capacity.max'] = { $gte: parseInt(capacity) };
    }
    
    // Amenities filter
    if (amenities) {
        const amenityList = amenities.split(',').map(a => a.trim());
        filter.amenities = { $in: amenityList };
    }
    
    const places = await Journey.find(filter)
        .sort({ 'rating.average': -1, 'pricing.basePrice': 1 })
        .limit(20)
        .populate('reviews', 'rating comment author')
        .populate('owner', 'username email');
    
    res.json({
        success: true,
        count: places.length,
        places: places
    });
});

// Get place details by ID
module.exports.getPlaceDetails = wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid place ID format'
        });
    }
    
    const place = await Journey.findById(id)
        .populate('reviews', 'rating comment author createdAt')
        .populate('owner', 'username email phone');
    
    if (!place) {
        return res.status(404).json({ 
            success: false,
            error: 'Place not found' 
        });
    }
    
    res.json({
        success: true,
        place: place
    });
});

// View place details page
module.exports.viewPlaceDetails = wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).render('error', {
            error: {
                message: 'Invalid place ID format',
                statusCode: 400
            }
        });
    }
    
    const place = await Journey.findById(id)
        .populate('reviews', 'rating comment author createdAt')
        .populate('owner', 'username email phone');
    
    if (!place) {
        return res.status(404).render('error', { 
            error: {
                message: 'Place not found',
                statusCode: 404
            }
        });
    }
    
    res.render('journey/details', { 
        layout: 'layouts/boilerplate',
        place: place 
    });
});

// Create new place
module.exports.createPlace = wrapAsync(async (req, res) => {
    const placeData = req.body;
    placeData.owner = req.user._id;
    
    // Process amenities array if it's a string
    if (placeData.amenities && typeof placeData.amenities === 'string') {
        placeData.amenities = placeData.amenities.split(',').map(a => a.trim());
    }
    
    // Process tags array if it's a string
    if (placeData.tags && typeof placeData.tags === 'string') {
        placeData.tags = placeData.tags.split(',').map(t => t.trim());
    }
    
    // Ensure GeoJSON point is set
    if (placeData.location && placeData.location.coordinates) {
        const lat = placeData.location.coordinates.latitude;
        const lng = placeData.location.coordinates.longitude;
        if (typeof lat === 'number' && typeof lng === 'number') {
            placeData.location.geo = { type: 'Point', coordinates: [lng, lat] };
        }
    }

    const place = new Journey(placeData);
    await place.save();
    
    res.status(201).json({
        success: true,
        message: 'Place created successfully',
        place: place
    });
});

// Update place
module.exports.updatePlace = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Process amenities array if it's a string
    if (updateData.amenities && typeof updateData.amenities === 'string') {
        updateData.amenities = updateData.amenities.split(',').map(a => a.trim());
    }
    
    // Process tags array if it's a string
    if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }
    
    // Ensure GeoJSON point is updated when coords change
    if (updateData.location && updateData.location.coordinates) {
        const lat = updateData.location.coordinates.latitude;
        const lng = updateData.location.coordinates.longitude;
        if (typeof lat === 'number' && typeof lng === 'number') {
            updateData['location.geo'] = { type: 'Point', coordinates: [lng, lat] };
        }
    }

    const place = await Journey.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
    );
    
    if (!place) {
        return res.status(404).json({ 
            error: 'Place not found' 
        });
    }
    
    res.json({
        success: true,
        message: 'Place updated successfully',
        place: place
    });
});

// Delete place
module.exports.deletePlace = wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    const place = await Journey.findByIdAndDelete(id);
    
    if (!place) {
        return res.status(404).json({ 
            error: 'Place not found' 
        });
    }
    
    res.json({
        success: true,
        message: 'Place deleted successfully'
    });
});

// Get places by type
module.exports.getPlacesByType = wrapAsync(async (req, res) => {
    const { type } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const places = await Journey.find({ 
        type: type, 
        isActive: true 
    })
    .sort({ 'rating.average': -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('reviews', 'rating comment author')
    .populate('owner', 'username email');
    
    const total = await Journey.countDocuments({ 
        type: type, 
        isActive: true 
    });
    
    res.json({
        success: true,
        count: places.length,
        total: total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        places: places
    });
});

// Get popular places
module.exports.getPopularPlaces = wrapAsync(async (req, res) => {
    const { limit = 10 } = req.query;
    
    const places = await Journey.find({ 
        isActive: true,
        'rating.average': { $gte: 4.0 }
    })
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(parseInt(limit))
    .populate('reviews', 'rating comment author')
    .populate('owner', 'username email');
    
    res.json({
        success: true,
        count: places.length,
        places: places
    });
});
