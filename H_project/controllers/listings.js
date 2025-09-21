const express = require("express");

const { predictPrice, getPriceInsights } = require('../utils/pricePredictor.js');
const Listing = require('../models/listing.js');

const mbxGeoconding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClien = mbxGeoconding({ accessToken: mapBoxToken });

const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const mbxClient = require('@mapbox/mapbox-sdk');

module.exports.createListing = async (req, res) => {
    try {
        const listingData = req.body.listing;
        
        // Debug: Log the received data
        console.log('Received listing data:', JSON.stringify(listingData, null, 2));
        console.log('Payment methods received:', listingData.paymentMethods);
        console.log('Amenities received:', listingData.amenities);
        
        // Validate required fields
        if (!listingData.title || listingData.title.trim().length < 3) {
            req.flash('error', 'Title must be at least 3 characters long');
            return res.redirect('/listings/new');
        }
        
        if (!listingData.description || listingData.description.length < 10) {
            req.flash('error', 'Description must be at least 10 characters long');
            return res.redirect('/listings/new');
        }
        
        if (!listingData.location || listingData.location.trim().length < 3) {
            req.flash('error', 'Location must be at least 3 characters long');
            return res.redirect('/listings/new');
        }
        
        if (!listingData.country || listingData.country.trim().length < 2) {
            req.flash('error', 'Country must be at least 2 characters long');
            return res.redirect('/listings/new');
        }
        
        if (!listingData.price || isNaN(parseFloat(listingData.price)) || parseFloat(listingData.price) < 0) {
            req.flash('error', 'Price must be a valid positive number');
            return res.redirect('/listings/new');
        }
        
        // Process services data to fix validation issues
        if (listingData.services) {
            // Ensure services is an object
            if (typeof listingData.services !== 'object') {
                listingData.services = {};
            }
            
            // Initialize nested objects if they don't exist
            if (!listingData.services.massage) listingData.services.massage = {};
            if (!listingData.services.chef) listingData.services.chef = {};
            if (!listingData.services.training) listingData.services.training = {};
            if (!listingData.services.events) listingData.services.events = {};
            if (!listingData.services.sports) listingData.services.sports = {};
            if (!listingData.services.sportsGroundForRent) listingData.services.sportsGroundForRent = {};
            
            // Fix massage priceList - convert string to array of objects
            if (listingData.services.massage.priceList) {
                if (typeof listingData.services.massage.priceList === 'string') {
                    const priceListStr = listingData.services.massage.priceList;
                    if (priceListStr && priceListStr.trim()) {
                        const priceItems = priceListStr.split(',').map(item => {
                            const [name, price] = item.split(':');
                            return {
                                name: name ? name.trim() : 'Service',
                                price: price ? parseInt(price.trim()) || 0 : 0
                            };
                        });
                        listingData.services.massage.priceList = priceItems;
                    } else {
                        listingData.services.massage.priceList = [];
                    }
                }
            } else {
                listingData.services.massage.priceList = [];
            }
            
            // Convert string arrays to actual arrays for other services
            const stringFields = ['food', 'chef.cuisines', 'massage.types', 'events.supported', 'sports.indoor', 'sports.outdoor',
                'training.yoga.benefits','training.karate.benefits','training.gym.benefits'];
            stringFields.forEach(field => {
                const keys = field.split('.');
                let obj = listingData.services;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!obj[keys[i]]) obj[keys[i]] = {};
                    obj = obj[keys[i]];
                }
                const lastKey = keys[keys.length - 1];
                if (obj[lastKey] && typeof obj[lastKey] === 'string') {
                    const trimmedItems = obj[lastKey].split(',').map(item => item.trim()).filter(item => item);
                    obj[lastKey] = trimmedItems.length > 0 ? trimmedItems : [];
                } else if (!obj[lastKey]) {
                    obj[lastKey] = [];
                }
            });
            
            // Ensure boolean fields are properly set
            if (listingData.services.chef.available === 'true') {
                listingData.services.chef.available = true;
            } else if (listingData.services.chef.available === 'false' || !listingData.services.chef.available) {
                listingData.services.chef.available = false;
            }
            
            if (listingData.services.sportsGroundForRent.available === 'true') {
                listingData.services.sportsGroundForRent.available = true;
            } else if (listingData.services.sportsGroundForRent.available === 'false' || !listingData.services.sportsGroundForRent.available) {
                listingData.services.sportsGroundForRent.available = false;
            }
        } else {
            // Initialize empty services object if it doesn't exist
            listingData.services = {
                food: [],
                chef: { available: false, cuisines: [], pricePerMeal: 0 },
                massage: { types: [], priceList: [] },
                training: { gym: { available: false, monthlyPrice: 0 }, yoga: { available: false, monthlyPrice: 0 }, karate: { available: false, monthlyPrice: 0 } },
                events: { supported: [] },
                sports: { indoor: [], outdoor: [] },
                sportsGroundForRent: { available: false, groundType: '', hourlyRate: 0 }
            };
        }
        
        // Get AI price prediction
        const features = {
            location: listingData.location,
            base_price: listingData.price,
            property_type: listingData.propertyType,
            amenities_score: 70, // Will be calculated in the ML service
            review_rating: 4.0, // Default for new listings
            booking_lead_time: 7,
            competitor_price: listingData.price * 1.1
        };
        
        const aiPrediction = await predictPrice(features);
        
        // Add AI data to listing
        listingData.aiPrice = aiPrediction.predicted_price;
        listingData.aiConfidence = aiPrediction.confidence;
        listingData.aiInsights = aiPrediction.insights;
        listingData.owner = req.user._id;
        
        // Process payment methods - ensure it's an array
        if (listingData.paymentMethods) {
            if (Array.isArray(listingData.paymentMethods)) {
                listingData.paymentMethods = listingData.paymentMethods.filter(method => method && method.trim());
            } else if (typeof listingData.paymentMethods === 'string') {
                listingData.paymentMethods = [listingData.paymentMethods.trim()].filter(method => method);
            } else {
                listingData.paymentMethods = [];
            }
        } else {
            listingData.paymentMethods = [];
        }
        
        console.log('Processed payment methods:', listingData.paymentMethods);
        
        // Process amenities - ensure it's an array
        if (listingData.amenities) {
            if (Array.isArray(listingData.amenities)) {
                listingData.amenities = listingData.amenities.filter(amenity => amenity && amenity.trim());
            } else if (typeof listingData.amenities === 'string') {
                listingData.amenities = [listingData.amenities.trim()].filter(amenity => amenity);
            } else {
                listingData.amenities = [];
            }
        } else {
            listingData.amenities = [];
        }
        
        console.log('Processed amenities:', listingData.amenities);
        
        // Handle image upload
        if (req.files && req.files['listing[image]'] && req.files['listing[image]'][0]) {
            listingData.image = { 
                url: req.files['listing[image]'][0].path, 
                filename: req.files['listing[image]'][0].filename 
            };
        }
        
        // Handle gallery images upload (if exists)
        if (req.files && req.files.gallery) {
            listingData.gallery = req.files.gallery.map(file => ({
                url: file.path,
                filename: file.filename
            }));
        }
        
        // Handle sports image upload (if exists)
        if (req.files && req.files.sportsImage && req.files.sportsImage[0]) {
            listingData.services.sports.image = {
                url: req.files.sportsImage[0].path,
                filename: req.files.sportsImage[0].filename
            };
        }
        
        console.log('Final listing data before saving:', JSON.stringify(listingData, null, 2));
        
        const listing = new Listing(listingData);
        await listing.save();
        
        console.log('Listing saved successfully with ID:', listing._id);
        
        req.flash('success', 'Listing created successfully with AI price prediction!');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error('Error creating listing:', error);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            req.flash('error', `Validation failed: ${errorMessages.join(', ')}`);
        } else if (error.code === 11000) {
            req.flash('error', 'A listing with this title already exists');
        } else if (error.message && error.message.includes('MAP_TOKEN')) {
            req.flash('error', 'Map service configuration error. Please try again.');
        } else {
            req.flash('error', 'Failed to create listing. Please try again.');
        }
        
        res.redirect('/listings/new');
    }
};


module.exports.index=async (req, res) => {
    const { q, type } = req.query;
    const filter = {};
    if (type) filter.propertyType = type;
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index", { allListings, layout: "layouts/boilerplate" });
}

module.exports.renderNewForm=(req, res) => {
    res.render("listings/new", { layout: "layouts/boilerplate" });
};

module.exports.showlisting= async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        
        // Get fresh AI insights for the listing
        let aiInsights = null;
        let mapCoords = null;
        try {
            aiInsights = await getPriceInsights(listing);
        } catch (aiError) {
            console.error('Error getting AI insights:', aiError);
            // Continue without AI insights if there's an error
        }
        
        // Geocode listing location for map display
        try {
            if (listing.location) {
                const geoRes = await geocodingClien.forwardGeocode({
                    query: listing.location,
                    limit: 1
                }).send();
                if (geoRes && geoRes.body && geoRes.body.features && geoRes.body.features.length > 0) {
                    mapCoords = geoRes.body.features[0].center; // [lng, lat]
                }
            }
        } catch (geoError) {
            console.error('Error geocoding location:', geoError);
        }
        
        res.render("listings/show", { 
            listing, 
            aiInsights,
            mapCoords,
            layout: "layouts/boilerplate" 
        });
    } catch (error) {
        console.error('Error showing listing:', error);
        
        // Handle specific error types
        if (error.name === 'CastError') {
            req.flash('error', 'Invalid listing ID format');
        } else if (error.name === 'ValidationError') {
            req.flash('error', 'Invalid listing data');
        } else {
            req.flash('error', 'Failed to load listing');
        }
        
        res.redirect('/listings');
    }
};

module.exports.renderEditForm= async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing, layout: "layouts/boilerplate" });
}

module.exports.createListingWithImage= async (req, res) =>{
    let url= req.file.path;
    let filename= req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: url, filename: filename };
    await newListing.save();
    res.redirect("/listings");
}

module.exports.updateListing= async (req, res) => {

    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });

    if(typeof req.file !== 'undefined'){
        let url= req.file.path;
        let filename= req.file.filename;
        updatedListing.image = { url: url, filename: filename };
        await updatedListing.save();
    }
    res.redirect(`/listings/${updatedListing._id}`);
}
module.exports.deleteListing= async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}


