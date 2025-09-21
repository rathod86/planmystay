const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journeySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['night_out', 'vacation', 'picnic', 'tour'],
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    location: {
        name: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90
            },
            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180
            }
        },
        // GeoJSON point for efficient geospatial queries
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [lng, lat]
                default: undefined
            }
        },
        address: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    images: [{
        url: String,
        filename: String,
        caption: String
    }],
    amenities: [{
        type: String,
        enum: [
            'parking', 'restaurant', 'restroom', 'wifi', 'ac', 'heating', 
            'swimming_pool', 'gym', 'spa', 'conference_room', 'garden',
            'playground', 'lake', 'mountain_view', 'beach_access', 'hiking_trail',
            'camping', 'bbq_area', 'bonfire', 'music_system', 'stage',
            'dance_floor', 'decorations', 'catering', 'photography'
        ]
    }],
    pricing: {
        basePrice: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'INR'
        },
        pricingType: {
            type: String,
            enum: ['per_person', 'per_group', 'per_hour', 'per_day', 'per_event'],
            default: 'per_person'
        },
        discounts: [{
            type: {
                type: String,
                enum: ['early_booking', 'group', 'seasonal', 'weekday', 'loyalty']
            },
            percentage: Number,
            minQuantity: Number,
            validFrom: Date,
            validTo: Date
        }]
    },
    capacity: {
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            required: true
        }
    },
    duration: {
        min: Number, // in hours
        max: Number, // in hours
        recommended: Number // in hours
    },
    bestTimeToVisit: {
        seasons: [{
            type: String,
            enum: ['spring', 'summer', 'monsoon', 'winter']
        }],
        months: [Number], // 1-12
        timeOfDay: [{
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night']
        }]
    },
    activities: [{
        name: String,
        description: String,
        duration: Number, // in minutes
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard']
        },
        ageGroup: {
            type: String,
            enum: ['all', 'adults', 'children', 'seniors']
        }
    }],
    contact: {
        phone: String,
        email: String,
        website: String,
        socialMedia: {
            instagram: String,
            facebook: String,
            twitter: String
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [String], // For search and filtering
    distanceFromCity: Number, // in km
    accessibility: {
        wheelchair: Boolean,
        elderly: Boolean,
        children: Boolean
    },
    safety: {
        security: Boolean,
        firstAid: Boolean,
        emergencyContact: String
    },
    bookingPolicy: {
        advanceBooking: Number, // days in advance
        cancellationPolicy: String,
        refundPolicy: String
    }
}, {
    timestamps: true
});

// Indexes for location-based searches
journeySchema.index({ 
    'location.coordinates.latitude': 1, 
    'location.coordinates.longitude': 1 
});
journeySchema.index({ 'location.geo': '2dsphere' });

// Index for text search
journeySchema.index({ 
    name: 'text', 
    description: 'text', 
    'location.name': 'text',
    tags: 'text'
});

// Index for filtering
journeySchema.index({ type: 1, isActive: 1 });
journeySchema.index({ 'pricing.basePrice': 1 });
journeySchema.index({ 'capacity.max': 1 });

// Virtual for distance calculation (will be populated by geospatial queries)
journeySchema.virtual('distance').get(function() {
    return this._distance;
});

journeySchema.set('toJSON', { virtuals: true });

const Journey = mongoose.model('Journey', journeySchema);
module.exports = Journey;
