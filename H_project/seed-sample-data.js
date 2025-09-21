const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

// Sample listings data
const sampleListings = [
    {
        title: "Luxury Beach Resort",
        description: "Experience the ultimate beachfront luxury with stunning ocean views, world-class amenities, and exceptional service.",
        image: {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
            filename: "beach-resort.jpg"
        },
        price: 2500,
        location: "Goa, India",
        country: "India",
        propertyType: "Hotel",
        pricingPeriod: "per night",
        phone: "+91 9876543210",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: {
                available: true,
                cuisines: ["Indian", "Continental", "Chinese"],
                priceRange: "₹500-₹2000"
            },
            massage: {
                available: true,
                types: ["Swedish", "Deep Tissue", "Hot Stone"],
                priceList: [
                    { name: "Swedish Massage", price: 1500 },
                    { name: "Deep Tissue", price: 2000 },
                    { name: "Hot Stone", price: 2500 }
                ]
            },
            training: {
                gym: { available: true, equipment: "Full gym equipment" },
                yoga: { available: true, instructor: "Certified yoga instructor" },
                karate: { available: false }
            },
            sports: {
                indoor: ["Table Tennis", "Badminton", "Chess"],
                outdoor: ["Beach Volleyball", "Swimming", "Kayaking"]
            }
        }
    },
    {
        title: "Mountain View Villa",
        description: "Escape to the mountains in this beautiful villa with panoramic mountain views and modern amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
            filename: "mountain-villa.jpg"
        },
        price: 1800,
        location: "Manali, Himachal Pradesh",
        country: "India",
        propertyType: "Apartment",
        pricingPeriod: "per night",
        phone: "+91 9876543211",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: {
                available: true,
                cuisines: ["North Indian", "Himachali", "Continental"],
                priceRange: "₹300-₹1500"
            },
            massage: {
                available: true,
                types: ["Aromatherapy", "Reflexology"],
                priceList: [
                    { name: "Aromatherapy", price: 1200 },
                    { name: "Reflexology", price: 1000 }
                ]
            },
            training: {
                gym: { available: true, equipment: "Basic gym equipment" },
                yoga: { available: true, instructor: "Experienced yoga teacher" },
                karate: { available: true, instructor: "Black belt instructor" }
            },
            sports: {
                indoor: ["Chess", "Carrom", "Table Tennis"],
                outdoor: ["Trekking", "Rock Climbing", "Paragliding"]
            }
        }
    },
    {
        title: "City Center Business Hotel",
        description: "Perfect for business travelers with modern facilities, conference rooms, and easy access to city attractions.",
        image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
            filename: "business-hotel.jpg"
        },
        price: 1200,
        location: "Mumbai, Maharashtra",
        country: "India",
        propertyType: "Hotel",
        pricingPeriod: "per night",
        phone: "+91 9876543212",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: {
                available: true,
                cuisines: ["Indian", "Chinese", "Italian", "Fast Food"],
                priceRange: "₹200-₹1200"
            },
            massage: {
                available: true,
                types: ["Swedish", "Thai"],
                priceList: [
                    { name: "Swedish Massage", price: 1000 },
                    { name: "Thai Massage", price: 1200 }
                ]
            },
            training: {
                gym: { available: true, equipment: "Modern gym equipment" },
                yoga: { available: false },
                karate: { available: false }
            },
            sports: {
                indoor: ["Gym", "Swimming Pool", "Spa"],
                outdoor: ["City Tours", "Shopping"]
            }
        }
    },
    {
        title: "Heritage Palace Hotel",
        description: "Experience royal luxury in this beautifully restored heritage palace with traditional architecture and modern amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            filename: "heritage-palace.jpg"
        },
        price: 3500,
        location: "Jaipur, Rajasthan",
        country: "India",
        propertyType: "Hotel",
        pricingPeriod: "per night",
        phone: "+91 9876543213",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: {
                available: true,
                cuisines: ["Rajasthani", "Mughlai", "Continental"],
                priceRange: "₹800-₹3000"
            },
            massage: {
                available: true,
                types: ["Ayurvedic", "Royal Spa Treatment"],
                priceList: [
                    { name: "Ayurvedic Massage", price: 2000 },
                    { name: "Royal Spa Treatment", price: 3500 }
                ]
            },
            training: {
                gym: { available: true, equipment: "Premium gym equipment" },
                yoga: { available: true, instructor: "Traditional yoga master" },
                karate: { available: false }
            },
            sports: {
                indoor: ["Chess", "Carrom", "Indoor Games"],
                outdoor: ["Camel Safari", "Elephant Ride", "Palace Tours"]
            }
        }
    },
    {
        title: "Cozy PG Accommodation",
        description: "Affordable and comfortable PG accommodation for students and working professionals with all basic amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            filename: "pg-accommodation.jpg"
        },
        price: 8000,
        location: "Bangalore, Karnataka",
        country: "India",
        propertyType: "PG",
        pricingPeriod: "per month",
        phone: "+91 9876543214",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: {
                available: true,
                cuisines: ["South Indian", "North Indian"],
                priceRange: "₹100-₹500"
            },
            massage: {
                available: false
            },
            training: {
                gym: { available: false },
                yoga: { available: false },
                karate: { available: false }
            },
            sports: {
                indoor: ["Common Room", "Study Area"],
                outdoor: ["Nearby Parks", "Shopping Areas"]
            }
        }
    }
];

async function seedSampleData() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/planmystay');
        console.log('Connected to MongoDB');

        // Clear existing listings
        await Listing.deleteMany({});
        console.log('Cleared existing listings');

        // Insert sample listings
        const insertedListings = await Listing.insertMany(sampleListings);
        console.log(`Inserted ${insertedListings.length} sample listings`);

        console.log('Sample data seeded successfully!');
        console.log('You can now view listings at: http://localhost:3000/listings');
        
    } catch (error) {
        console.error('Error seeding sample data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeding function
seedSampleData();
