const Journey = require('../models/journey.js');
const mongoose = require('mongoose');

const sampleJourneys = [
    {
        name: "Cubbon Park",
        type: "picnic",
        description: "A beautiful park in the heart of Bangalore, perfect for picnics, morning walks, and family outings. Features lush greenery, walking trails, and children's play area.",
        location: {
            name: "Cubbon Park, Bangalore",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "Cubbon Park, Kasturba Road, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
            filename: "cubbon-park.jpg",
            caption: "Beautiful Cubbon Park"
        }],
        amenities: ["parking", "restroom", "garden", "playground", "hiking_trail"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 100
        },
        duration: {
            min: 1,
            max: 4,
            recommended: 2
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "evening"]
        },
        activities: [{
            name: "Morning Walk",
            description: "Peaceful morning walks in nature",
            duration: 60,
            difficulty: "easy",
            ageGroup: "all"
        }],
        contact: {
            phone: "+91-80-22221188",
            email: "info@cubbonpark.com"
        },
        rating: {
            average: 4.5,
            count: 150
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["park", "nature", "family", "walking", "bangalore"]
    },
    {
        name: "Lalbagh Botanical Garden",
        type: "picnic",
        description: "Famous botanical garden with diverse plant species, glass house, and beautiful landscapes. Perfect for nature lovers and photography enthusiasts.",
        location: {
            name: "Lalbagh Botanical Garden, Bangalore",
            coordinates: {
                latitude: 12.9507,
                longitude: 77.5848
            },
            geo: {
                type: "Point",
                coordinates: [77.5848, 12.9507]
            },
            address: "Lalbagh Botanical Garden, Mavalli, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
            filename: "lalbagh-garden.jpg",
            caption: "Lalbagh Botanical Garden"
        }],
        amenities: ["parking", "restroom", "garden", "hiking_trail", "photography"],
        pricing: {
            basePrice: 20,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 200
        },
        duration: {
            min: 2,
            max: 6,
            recommended: 3
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "afternoon"]
        },
        activities: [{
            name: "Garden Tour",
            description: "Explore diverse plant species and glass house",
            duration: 120,
            difficulty: "easy",
            ageGroup: "all"
        }],
        contact: {
            phone: "+91-80-26574003",
            email: "info@lalbagh.org"
        },
        rating: {
            average: 4.3,
            count: 200
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["garden", "botanical", "nature", "photography", "bangalore"]
    },
    {
        name: "Nandi Hills",
        type: "night_out",
        description: "Scenic hill station near Bangalore, famous for sunrise views, trekking, and cool weather. Perfect for a day trip or weekend getaway.",
        location: {
            name: "Nandi Hills, Karnataka",
            coordinates: {
                latitude: 13.3700,
                longitude: 77.6800
            },
            geo: {
                type: "Point",
                coordinates: [77.6800, 13.3700]
            },
            address: "Nandi Hills, Chikkaballapur, Karnataka",
            city: "Chikkaballapur",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
            filename: "nandi-hills.jpg",
            caption: "Beautiful Nandi Hills"
        }],
        amenities: ["parking", "restroom", "mountain_view", "hiking_trail", "restaurant"],
        pricing: {
            basePrice: 50,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 50
        },
        duration: {
            min: 4,
            max: 8,
            recommended: 6
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "evening"]
        },
        activities: [{
            name: "Sunrise Viewing",
            description: "Watch beautiful sunrise from the hilltop",
            duration: 120,
            difficulty: "medium",
            ageGroup: "adults"
        }],
        contact: {
            phone: "+91-8151-222333",
            email: "info@nandihills.com"
        },
        rating: {
            average: 4.6,
            count: 300
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["hills", "sunrise", "trekking", "nature", "weekend"]
    },
    {
        name: "Wonderla Amusement Park",
        type: "vacation",
        description: "Thrilling amusement park with water rides, roller coasters, and entertainment shows. Perfect for families and adventure seekers.",
        location: {
            name: "Wonderla, Bangalore",
            coordinates: {
                latitude: 12.8300,
                longitude: 77.4000
            },
            geo: {
                type: "Point",
                coordinates: [77.4000, 12.8300]
            },
            address: "Wonderla Amusement Park, Mysore Road, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
            filename: "wonderla-park.jpg",
            caption: "Wonderla Amusement Park"
        }],
        amenities: ["parking", "restroom", "restaurant", "swimming_pool", "playground"],
        pricing: {
            basePrice: 1200,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 500
        },
        duration: {
            min: 6,
            max: 10,
            recommended: 8
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "afternoon"]
        },
        activities: [{
            name: "Water Rides",
            description: "Enjoy thrilling water slides and rides",
            duration: 240,
            difficulty: "medium",
            ageGroup: "all"
        }],
        contact: {
            phone: "+91-80-22040000",
            email: "info@wonderla.com"
        },
        rating: {
            average: 4.2,
            count: 500
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["amusement", "water_park", "family", "adventure", "fun"]
    },
    {
        name: "Bangalore Palace",
        type: "tour",
        description: "Historic palace with beautiful architecture and royal heritage. Guided tours available to explore the royal history and architecture.",
        location: {
            name: "Bangalore Palace, Bangalore",
            coordinates: {
                latitude: 12.9981,
                longitude: 77.5925
            },
            geo: {
                type: "Point",
                coordinates: [77.5925, 12.9981]
            },
            address: "Bangalore Palace, Vasanth Nagar, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
            filename: "bangalore-palace.jpg",
            caption: "Bangalore Palace"
        }],
        amenities: ["parking", "restroom", "photography"],
        pricing: {
            basePrice: 230,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 100
        },
        duration: {
            min: 1,
            max: 3,
            recommended: 2
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "afternoon"]
        },
        activities: [{
            name: "Palace Tour",
            description: "Guided tour of the royal palace and its history",
            duration: 90,
            difficulty: "easy",
            ageGroup: "all"
        }],
        contact: {
            phone: "+91-80-23360185",
            email: "info@bangalorepalace.com"
        },
        rating: {
            average: 4.0,
            count: 180
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["palace", "history", "architecture", "royal", "heritage"]
    },
    // Famous Malls
    {
        name: "Phoenix Marketcity",
        type: "night_out",
        description: "One of Bangalore's largest shopping malls with over 200 stores, entertainment zones, food courts, and multiplex. Perfect for shopping, dining, and entertainment.",
        location: {
            name: "Phoenix Marketcity, Whitefield",
            coordinates: {
                latitude: 12.9698,
                longitude: 77.7500
            },
            geo: {
                type: "Point",
                coordinates: [77.7500, 12.9698]
            },
            address: "Phoenix Marketcity, Whitefield Road, Mahadevapura",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1555529902-2a0b0b4a8b8b?w=500",
            filename: "phoenix-marketcity.jpg",
            caption: "Phoenix Marketcity Mall"
        }],
        amenities: ["parking", "restaurant", "restroom", "wifi", "ac", "music_system", "stage", "catering"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 1000
        },
        duration: {
            min: 2,
            max: 8,
            recommended: 4
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["morning", "afternoon", "evening", "night"]
        },
        activities: [{
            name: "Shopping",
            description: "Over 200 retail stores and brands"
        }, {
            name: "Dining",
            description: "Multiple restaurants and food courts"
        }, {
            name: "Entertainment",
            description: "Cinema, gaming zones, and activities"
        }],
        contact: {
            phone: "+91-80-4179-1000",
            email: "info@phoenixmarketcity.com"
        },
        rating: {
            average: 4.3,
            count: 1250
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["mall", "shopping", "entertainment", "whitefield", "bangalore"]
    },
    {
        name: "Orion Mall",
        type: "night_out",
        description: "Premium shopping destination in Rajajinagar with luxury brands, fine dining restaurants, and entertainment options. Great for a night out with friends and family.",
        location: {
            name: "Orion Mall, Rajajinagar",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "Orion Mall, Dr. Rajkumar Road, Rajajinagar",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1555529902-2a0b0b4a8b8b?w=500",
            filename: "orion-mall.jpg",
            caption: "Orion Mall Rajajinagar"
        }],
        amenities: ["parking", "restaurant", "restroom", "wifi", "ac", "music_system", "stage", "catering"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 800
        },
        duration: {
            min: 2,
            max: 6,
            recommended: 3
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["afternoon", "evening", "night"]
        },
        activities: [{
            name: "Luxury Shopping",
            description: "Premium brands and luxury stores"
        }, {
            name: "Fine Dining",
            description: "High-end restaurants and cafes"
        }, {
            name: "Entertainment",
            description: "Cinema and gaming zones"
        }],
        contact: {
            phone: "+91-80-4111-2222",
            email: "info@orionmall.com"
        },
        rating: {
            average: 4.2,
            count: 890
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["mall", "luxury", "shopping", "rajajinagar", "bangalore"]
    },
    // Famous Food Places
    {
        name: "Vidyarthi Bhavan",
        type: "picnic",
        description: "Legendary South Indian restaurant famous for its crispy dosas and traditional breakfast. A must-visit for food lovers and a perfect spot for a food tour.",
        location: {
            name: "Vidyarthi Bhavan, Basavanagudi",
            coordinates: {
                latitude: 12.9478,
                longitude: 77.5961
            },
            geo: {
                type: "Point",
                coordinates: [77.5961, 12.9478]
            },
            address: "Vidyarthi Bhavan, 32 Gandhi Bazaar Main Road, Basavanagudi",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
            filename: "vidyarthi-bhavan.jpg",
            caption: "Famous Vidyarthi Bhavan Dosa"
        }],
        amenities: ["restaurant", "restroom", "catering", "photography"],
        pricing: {
            basePrice: 150,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 50
        },
        duration: {
            min: 1,
            max: 2,
            recommended: 1
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["morning", "afternoon"]
        },
        activities: [{
            name: "Traditional Breakfast",
            description: "Famous crispy dosas and South Indian breakfast"
        }, {
            name: "Food Photography",
            description: "Perfect for food bloggers and photographers"
        }],
        contact: {
            phone: "+91-80-2667-7588",
            email: "info@vidyarthibhavan.com"
        },
        rating: {
            average: 4.5,
            count: 2100
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["food", "dosa", "traditional", "breakfast", "basavanagudi", "bangalore"]
    },
    {
        name: "MTR (Mavalli Tiffin Room)",
        type: "picnic",
        description: "Iconic restaurant serving authentic South Indian cuisine since 1924. Famous for its rava idli, masala dosa, and traditional thali. A heritage food experience.",
        location: {
            name: "MTR, Lalbagh Road",
            coordinates: {
                latitude: 12.9500,
                longitude: 77.5800
            },
            geo: {
                type: "Point",
                coordinates: [77.5800, 12.9500]
            },
            address: "MTR, 14 Lalbagh Road, Basavanagudi",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
            filename: "mtr-restaurant.jpg",
            caption: "Famous MTR Restaurant"
        }],
        amenities: ["restaurant", "restroom", "catering", "photography"],
        pricing: {
            basePrice: 200,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 60
        },
        duration: {
            min: 1,
            max: 2,
            recommended: 1
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["morning", "afternoon", "evening"]
        },
        activities: [{
            name: "Heritage Dining",
            description: "Traditional South Indian thali and specialties"
        }, {
            name: "Cultural Experience",
            description: "Experience authentic Bangalore food culture"
        }],
        contact: {
            phone: "+91-80-2222-0022",
            email: "info@mtrfoods.com"
        },
        rating: {
            average: 4.4,
            count: 1800
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["food", "heritage", "traditional", "thali", "lalbagh", "bangalore"]
    },
    // Famous Tourist Attractions
    {
        name: "Vidhana Soudha",
        type: "tour",
        description: "The magnificent seat of the state legislature of Karnataka, known for its Dravidian architecture. A must-visit for architecture enthusiasts and history lovers.",
        location: {
            name: "Vidhana Soudha, Cubbon Park",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "Vidhana Soudha, Ambedkar Veedhi, Sampangi Rama Nagar",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500",
            filename: "vidhana-soudha.jpg",
            caption: "Vidhana Soudha - Karnataka Legislature"
        }],
        amenities: ["parking", "restroom", "photography"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 100
        },
        duration: {
            min: 1,
            max: 3,
            recommended: 2
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring"],
            months: [10, 11, 12, 1, 2, 3],
            timeOfDay: ["morning", "evening"]
        },
        activities: [{
            name: "Architecture Tour",
            description: "Explore Dravidian architectural marvel"
        }, {
            name: "Photography",
            description: "Perfect for architectural photography"
        }, {
            name: "Heritage Walk",
            description: "Learn about Karnataka's political history"
        }],
        contact: {
            phone: "+91-80-2235-0000",
            email: "info@karnataka.gov.in"
        },
        rating: {
            average: 4.6,
            count: 950
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["architecture", "heritage", "government", "cubbon_park", "bangalore"]
    },
    {
        name: "ISKCON Temple",
        type: "tour",
        description: "Beautiful Krishna temple with stunning architecture and peaceful atmosphere. Perfect for spiritual seekers and those interested in Hindu culture and architecture.",
        location: {
            name: "ISKCON Temple, Rajajinagar",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "ISKCON Temple, Hare Krishna Hill, Chord Road, Rajajinagar",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500",
            filename: "iskcon-temple.jpg",
            caption: "ISKCON Temple Bangalore"
        }],
        amenities: ["parking", "restroom", "garden", "photography"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 500
        },
        duration: {
            min: 1,
            max: 3,
            recommended: 2
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["morning", "evening"]
        },
        activities: [{
            name: "Spiritual Experience",
            description: "Meditation and prayer sessions"
        }, {
            name: "Temple Tour",
            description: "Learn about Krishna consciousness"
        }, {
            name: "Prasadam",
            description: "Enjoy vegetarian temple food"
        }],
        contact: {
            phone: "+91-80-2357-8346",
            email: "info@iskconbangalore.org"
        },
        rating: {
            average: 4.7,
            count: 3200
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["temple", "spiritual", "krishna", "meditation", "rajajinagar", "bangalore"]
    },
    // Entertainment and Nightlife
    {
        name: "UB City",
        type: "night_out",
        description: "Luxury shopping and entertainment complex in the heart of Bangalore. Features high-end brands, fine dining restaurants, and upscale nightlife options.",
        location: {
            name: "UB City, Vittal Mallya Road",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "UB City, 24 Vittal Mallya Road, UB City",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1555529902-2a0b0b4a8b8b?w=500",
            filename: "ub-city.jpg",
            caption: "UB City Luxury Complex"
        }],
        amenities: ["parking", "restaurant", "restroom", "wifi", "ac", "music_system", "stage", "catering"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 300
        },
        duration: {
            min: 2,
            max: 6,
            recommended: 4
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["evening", "night"]
        },
        activities: [{
            name: "Luxury Shopping",
            description: "High-end international brands"
        }, {
            name: "Fine Dining",
            description: "Upscale restaurants and bars"
        }, {
            name: "Nightlife",
            description: "Premium clubs and lounges"
        }],
        contact: {
            phone: "+91-80-4111-3333",
            email: "info@ubcity.com"
        },
        rating: {
            average: 4.4,
            count: 1500
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["luxury", "shopping", "nightlife", "fine_dining", "vittal_mallya", "bangalore"]
    },
    {
        name: "Brigade Road",
        type: "night_out",
        description: "Famous commercial street in Bangalore known for its vibrant nightlife, street food, shopping, and entertainment. Perfect for a night out with friends.",
        location: {
            name: "Brigade Road, MG Road",
            coordinates: {
                latitude: 12.9716,
                longitude: 77.5946
            },
            geo: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "Brigade Road, MG Road Area",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        },
        images: [{
            url: "https://images.unsplash.com/photo-1555529902-2a0b0b4a8b8b?w=500",
            filename: "brigade-road.jpg",
            caption: "Brigade Road Nightlife"
        }],
        amenities: ["parking", "restaurant", "restroom", "music_system", "stage", "catering", "photography"],
        pricing: {
            basePrice: 0,
            currency: "INR",
            pricingType: "per_person"
        },
        capacity: {
            min: 1,
            max: 200
        },
        duration: {
            min: 2,
            max: 5,
            recommended: 3
        },
        bestTimeToVisit: {
            seasons: ["winter", "spring", "summer"],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            timeOfDay: ["evening", "night"]
        },
        activities: [{
            name: "Street Food Tour",
            description: "Explore local street food and snacks"
        }, {
            name: "Shopping",
            description: "Fashion stores and local markets"
        }, {
            name: "Nightlife",
            description: "Pubs, bars, and entertainment venues"
        }],
        contact: {
            phone: "+91-80-2558-0000",
            email: "info@brigaderoad.com"
        },
        rating: {
            average: 4.3,
            count: 2800
        },
        owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        isActive: true,
        tags: ["nightlife", "street_food", "shopping", "entertainment", "mg_road", "bangalore"]
    }
];

async function seedJourneyData() {
    try {
        // Clear existing journey data
        await Journey.deleteMany({});
        console.log('Cleared existing journey data');
        
        // Insert sample data
        await Journey.insertMany(sampleJourneys);
        console.log('Successfully seeded journey data with', sampleJourneys.length, 'places');
        
        // Create 2dsphere index for geospatial queries
        await Journey.collection.createIndex({ 'location.geo': '2dsphere' });
        console.log('Created 2dsphere index for geospatial queries');
        
    } catch (error) {
        console.error('Error seeding journey data:', error);
    }
}

module.exports = { seedJourneyData, sampleJourneys };
