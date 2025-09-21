const axios = require('axios');

async function predictPrice(features) {
    try {
        const response = await axios.post('http://localhost:5000/predict', features);
        return response.data;
    } catch (error) {
        console.error('Error predicting price:', error);
        // Fallback to enhanced calculation if ML service is down
        const fallbackPrice = calculateFallbackPrice(features);
        const confidence = calculateConfidence(features, fallbackPrice);
        return {
            predicted_price: fallbackPrice,
            confidence: confidence,
            insights: generateInsights(features),
            error: 'ML service unavailable, using enhanced fallback calculation'
        };
    }
}

function calculateFallbackPrice(features) {
    const basePrice = features.base_price || 100;
    const location = (features.location || '').toLowerCase();
    const propertyType = features.property_type || 1;
    const amenitiesScore = features.amenities_score || 70;
    const reviewRating = features.review_rating || 4.0;
    const competitorPrice = features.competitor_price || 120;
    
    // Enhanced fallback calculation with better accuracy
    let price = basePrice;
    
    // Location-based multiplier
    const locationMultipliers = {
        'mumbai': 1.3, 'delhi': 1.2, 'bangalore': 1.15, 'pune': 1.1, 'goa': 1.25,
        'kolkata': 1.05, 'chennai': 1.1, 'hyderabad': 1.1, 'ahmedabad': 1.0
    };
    const locationMultiplier = locationMultipliers[location] || 1.0;
    price *= locationMultiplier;
    
    // Property type multiplier
    const typeMultipliers = { 1: 1.2, 2: 1.0, 3: 0.8, 4: 0.7, 5: 1.5, 6: 1.1 };
    price *= (typeMultipliers[propertyType] || 1.0);
    
    // Amenities factor (0.5 to 1.5 range)
    const amenitiesFactor = 0.5 + (amenitiesScore / 100);
    price *= amenitiesFactor;
    
    // Review rating factor (0.8 to 1.2 range)
    const ratingFactor = 0.8 + (reviewRating - 1) * 0.1;
    price *= ratingFactor;
    
    // Seasonal factor
    const month = new Date().getMonth() + 1;
    let seasonalFactor = 1.0;
    if (month >= 10 || month <= 3) seasonalFactor = 1.2; // Peak season
    else if (month >= 6 && month <= 8) seasonalFactor = 0.9; // Off season
    price *= seasonalFactor;
    
    // Competitor price influence (30% weight)
    price = (price * 0.7) + (competitorPrice * 0.3);
    
    return Math.round(price);
}

async function getPriceInsights(listing) {
    try {
        const features = {
            location: listing.location,
            base_price: listing.price,
            property_type: getPropertyTypeCode(listing.propertyType),
            amenities_score: calculateAmenitiesScore(listing),
            review_rating: calculateAverageRating(listing.reviews),
            booking_lead_time: 7, // Default
            competitor_price: listing.price * 1.1 // Mock competitor price
        };
        
        return await predictPrice(features);
    } catch (error) {
        console.error('Error getting price insights:', error);
        return null;
    }
}

function getPropertyTypeCode(propertyType) {
    const typeMap = {
        'Hotel': 1,
        'Apartment': 2,
        'Room Rental': 3,
        'PG': 4,
        'Land for Sale': 5,
        'Business Rental': 6
    };
    return typeMap[propertyType] || 1;
}

function calculateAmenitiesScore(listing) {
    // Mock amenities score based on description
    let score = 50; // Base score
    const description = (listing.description || '').toLowerCase();
    
    if (description.includes('wifi') || description.includes('internet')) score += 10;
    if (description.includes('ac') || description.includes('air conditioning')) score += 15;
    if (description.includes('parking')) score += 10;
    if (description.includes('gym') || description.includes('fitness')) score += 15;
    if (description.includes('pool')) score += 20;
    if (description.includes('restaurant') || description.includes('dining')) score += 10;
    
    return Math.min(100, score);
}

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 4.0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

function calculateConfidence(features, predictedPrice) {
    let confidence = 60; // Base confidence
    
    // Location confidence boost
    const location = (features.location || '').toLowerCase();
    const knownLocations = ['mumbai', 'delhi', 'bangalore', 'pune', 'goa', 'kolkata', 'chennai', 'hyderabad'];
    if (knownLocations.includes(location)) confidence += 15;
    
    // Property type confidence
    const propertyType = features.property_type || 1;
    if (propertyType >= 1 && propertyType <= 6) confidence += 10;
    
    // Amenities score confidence
    const amenitiesScore = features.amenities_score || 70;
    if (amenitiesScore > 80) confidence += 10;
    else if (amenitiesScore > 60) confidence += 5;
    
    // Review rating confidence
    const reviewRating = features.review_rating || 4.0;
    if (reviewRating >= 4.5) confidence += 10;
    else if (reviewRating >= 4.0) confidence += 5;
    
    // Price reasonableness check
    const basePrice = features.base_price || 100;
    const priceRatio = predictedPrice / basePrice;
    if (priceRatio >= 0.8 && priceRatio <= 1.5) confidence += 10;
    else if (priceRatio >= 0.6 && priceRatio <= 2.0) confidence += 5;
    
    return Math.min(95, Math.max(65, confidence)); // Keep between 65-95%
}

function generateInsights(features) {
    const location = (features.location || '').toLowerCase();
    const amenitiesScore = features.amenities_score || 70;
    const reviewRating = features.review_rating || 4.0;
    
    // Demand level based on location and amenities
    let demandLevel = 'Medium';
    if (['mumbai', 'delhi', 'bangalore', 'goa'].includes(location) && amenitiesScore > 80) {
        demandLevel = 'High';
    } else if (amenitiesScore < 50) {
        demandLevel = 'Low';
    }
    
    // Event impact based on location
    const eventImpact = ['mumbai', 'delhi', 'bangalore'].includes(location) ? 'High' : 'Medium';
    
    // Seasonal factor
    const month = new Date().getMonth() + 1;
    let seasonalFactor = 'Normal';
    if (month >= 10 || month <= 3) seasonalFactor = 'Peak';
    else if (month >= 6 && month <= 8) seasonalFactor = 'Low';
    
    // Weather impact
    const weatherImpact = ['goa', 'mumbai'].includes(location) ? 'Positive' : 'Neutral';
    
    return {
        demand_level: demandLevel,
        event_impact: eventImpact,
        seasonal_factor: seasonalFactor,
        weather_impact: weatherImpact
    };
}

module.exports = { 
    predictPrice, 
    getPriceInsights,
    calculateFallbackPrice,
    calculateConfidence,
    generateInsights
};