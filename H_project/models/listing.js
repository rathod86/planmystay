const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema =mongoose.Schema;

const listingSchema = new Schema({
    title:{
       type: String,
       required: true,
    },
    propertyType:{
        type: String,
        enum: ['Hotel', 'PG', 'Land for Sale', 'Room Rental', 'Apartment', 'Reception Hall', 'Event Hall', 'Business Rental'],
        required: true
    },
    description:String,
    image:{
        //type:String,
        filename: String,
        url:String,
        //set:(v)=>v==""?"default link" :v,

    },
    gallery: [{
        filename: String,
        url: String
    }],
    price:Number,
    pricingPeriod:{
        type: String,
        enum: ['per night', 'per week', 'per month'],
        default: 'per night'
    },
    location:String,
    phone:String,
    email: String,
    country:String,
    bedrooms: String,
    bathrooms: String,
    maxGuests: Number,
    checkIn: String,
    checkOut: String,
    amenities: [String],
    paymentMethods: [String],
    upiId: String,
    bankAccount: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // Optional payment/contact details for owner
    payment: {
        upiId: String,
        phoneNumber: String,
        qrImageUrl: String,
        methods: [String]
    },
    // AI Prediction Fields
    aiPrice: {
        type: Number,
        default: null
    },
    aiConfidence: {
        type: Number,
        default: null
    },
    aiInsights: {
        demand_level: String,
        event_impact: String,
        seasonal_factor: String,
        weather_impact: String
    },
    // Rich services offered at the property or nearby
    services: {
        food: {
            type: [String], // e.g., ['Veg', 'Non-Veg', 'Vegan', 'Local Cuisine']
            default: []
        },
        chef: {
            available: { type: Boolean, default: false },
            cuisines: { type: [String], default: [] },
            pricePerMeal: Number
        },
        training: {
            yoga: { 
                available: { type: Boolean, default: false }, 
                instructor: String, 
                monthlyPrice: Number,
                pricePerSession: Number,
                description: String,
                benefits: { type: [String], default: [] },
                schedule: String
            },
            karate: { 
                available: { type: Boolean, default: false }, 
                instructor: String, 
                monthlyPrice: Number,
                pricePerSession: Number,
                description: String,
                benefits: { type: [String], default: [] },
                schedule: String
            },
            gym: { 
                available: { type: Boolean, default: false }, 
                monthlyPrice: Number,
                dayPassPrice: Number,
                description: String,
                benefits: { type: [String], default: [] },
                schedule: String
            }
        },
        massage: {
            types: { type: [String], default: [] }, // e.g., ['Ayurvedic', 'Swedish']
            priceList: [{ name: String, price: Number }] // [{name:"Deep Tissue", price: 1500}]
        },
        events: {
            supported: { type: [String], default: [] } // e.g., ['Birthday', 'Marriage', 'Corporate']
        },
        sports: {
            indoor: { type: [String], default: [] },  // e.g., ['Carrom','Table Tennis']
            outdoor: { type: [String], default: [] },   // e.g., ['Cricket','Football']
            image: {
                url: String,
                filename: String
            }
        },
        sportsGroundForRent: {
            available: { type: Boolean, default: false },
            groundType: String, // e.g., 'Cricket', 'Football', 'Multipurpose'
            hourlyRate: Number
        }
    },
    // Area development status
    areaDevelopment: {
        status: { type: String, enum: ['Developed', 'Developing', 'Underdeveloped'], default: 'Developing' },
        images: { type: [String], default: [] } // URLs of images
    },
    // Social/media links
    media: {
        instagram: String,
        facebook: String,
        website: String
    },
    lastAIPrediction: {
        type: Date,
        default: Date.now
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;