const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

// Sample listings data with correct schema
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
        email: "info@beachresort.com",
        bedrooms: "2",
        bathrooms: "2",
        maxGuests: 4,
        checkIn: "15:00",
        checkOut: "11:00",
        amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym", "Kitchen"],
        paymentMethods: ["Google Pay", "UPI", "Paytm"],
        upiId: "beachresort@paytm",
        bankAccount: "1234567890",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: ["Veg", "Non-Veg", "Vegan"],
            chef: {
                available: true,
                cuisines: ["Indian", "Continental", "Chinese"],
                pricePerMeal: 500
            },
            massage: {
                types: ["Swedish", "Deep Tissue", "Hot Stone"],
                priceList: [
                    { name: "Swedish Massage", price: 1500 },
                    { name: "Deep Tissue", price: 2000 },
                    { name: "Hot Stone", price: 2500 }
                ]
            },
            training: {
                gym: { available: true, monthlyPrice: 2000 },
                yoga: { available: true, monthlyPrice: 1500 },
                karate: { available: false, monthlyPrice: 0 }
            },
            sports: {
                indoor: ["Table Tennis", "Badminton", "Chess"],
                outdoor: ["Beach Volleyball", "Swimming", "Kayaking"]
            },
            events: {
                supported: ["Birthday", "Wedding", "Corporate"]
            },
            sportsGroundForRent: {
                available: true,
                groundType: "Beach Volleyball",
                hourlyRate: 1000
            }
        },
        media: {
            instagram: "https://instagram.com/beachresort",
            facebook: "https://facebook.com/beachresort",
            website: "https://beachresort.com"
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
        location: "Shimla, India",
        country: "India",
        propertyType: "Apartment",
        pricingPeriod: "per night",
        phone: "+91 9876543211",
        email: "info@mountainvilla.com",
        bedrooms: "3",
        bathrooms: "2",
        maxGuests: 6,
        checkIn: "14:00",
        checkOut: "12:00",
        amenities: ["WiFi", "Parking", "Heating", "Kitchen", "TV"],
        paymentMethods: ["UPI", "PhonePe", "Cash on Delivery"],
        upiId: "mountainvilla@paytm",
        bankAccount: "1234567891",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: ["Veg", "Local Cuisine"],
            chef: {
                available: true,
                cuisines: ["North Indian", "Himachali"],
                pricePerMeal: 300
            },
            massage: {
                types: ["Ayurvedic", "Traditional"],
                priceList: [
                    { name: "Ayurvedic Massage", price: 1200 },
                    { name: "Traditional Massage", price: 800 }
                ]
            },
            training: {
                gym: { available: false, monthlyPrice: 0 },
                yoga: { available: true, monthlyPrice: 1000 },
                karate: { available: false, monthlyPrice: 0 }
            },
            sports: {
                indoor: ["Chess", "Carrom"],
                outdoor: ["Trekking", "Hiking", "Photography"]
            },
            events: {
                supported: ["Family Reunion", "Anniversary"]
            },
            sportsGroundForRent: {
                available: false,
                groundType: "",
                hourlyRate: 0
            }
        },
        media: {
            instagram: "https://instagram.com/mountainvilla",
            facebook: "https://facebook.com/mountainvilla",
            website: "https://mountainvilla.com"
        }
    },
    {
        title: "Urban Studio Apartment",
        description: "Modern studio apartment in the heart of the city, perfect for business travelers and urban explorers.",
        image: {
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
            filename: "urban-studio.jpg"
        },
        price: 1200,
        location: "Mumbai, India",
        country: "India",
        propertyType: "Apartment",
        pricingPeriod: "per night",
        phone: "+91 9876543212",
        email: "info@urbanstudio.com",
        bedrooms: "1",
        bathrooms: "1",
        maxGuests: 2,
        checkIn: "15:00",
        checkOut: "11:00",
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "TV", "Security System"],
        paymentMethods: ["Google Pay", "UPI", "Paytm", "PhonePe"],
        upiId: "urbanstudio@paytm",
        bankAccount: "1234567892",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: ["Veg", "Non-Veg", "Street Food"],
            chef: {
                available: false,
                cuisines: [],
                pricePerMeal: 0
            },
            massage: {
                types: [],
                priceList: []
            },
            training: {
                gym: { available: true, monthlyPrice: 1500 },
                yoga: { available: false, monthlyPrice: 0 },
                karate: { available: false, monthlyPrice: 0 }
            },
            sports: {
                indoor: ["Gym", "Table Tennis"],
                outdoor: ["Jogging", "Cycling"]
            },
            events: {
                supported: ["Business Meeting", "Small Gathering"]
            },
            sportsGroundForRent: {
                available: false,
                groundType: "",
                hourlyRate: 0
            }
        },
        media: {
            instagram: "https://instagram.com/urbanstudio",
            facebook: "https://facebook.com/urbanstudio",
            website: "https://urbanstudio.com"
        }
    },
    {
        title: "Heritage Palace Hotel",
        description: "Experience royal luxury in this beautifully restored heritage palace with traditional architecture and modern amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
            filename: "heritage-palace.jpg"
        },
        price: 3500,
        location: "Jaipur, India",
        country: "India",
        propertyType: "Hotel",
        pricingPeriod: "per night",
        phone: "+91 9876543213",
        email: "info@heritagepalace.com",
        bedrooms: "4",
        bathrooms: "3",
        maxGuests: 8,
        checkIn: "14:00",
        checkOut: "12:00",
        amenities: ["WiFi", "Parking", "Air Conditioning", "Swimming Pool", "Gym", "Kitchen", "TV", "Security System"],
        paymentMethods: ["Google Pay", "UPI", "Paytm", "PhonePe", "Cash on Delivery"],
        upiId: "heritagepalace@paytm",
        bankAccount: "1234567893",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: ["Veg", "Non-Veg", "Rajasthani Cuisine", "Royal Cuisine"],
            chef: {
                available: true,
                cuisines: ["Rajasthani", "Mughlai", "Continental"],
                pricePerMeal: 800
            },
            massage: {
                types: ["Ayurvedic", "Royal Spa", "Traditional"],
                priceList: [
                    { name: "Royal Spa Treatment", price: 3000 },
                    { name: "Ayurvedic Massage", price: 2000 },
                    { name: "Traditional Massage", price: 1500 }
                ]
            },
            training: {
                gym: { available: true, monthlyPrice: 3000 },
                yoga: { available: true, monthlyPrice: 2000 },
                karate: { available: true, monthlyPrice: 2500 }
            },
            sports: {
                indoor: ["Chess", "Carrom", "Table Tennis", "Badminton"],
                outdoor: ["Cricket", "Football", "Horse Riding", "Archery"]
            },
            events: {
                supported: ["Wedding", "Corporate", "Birthday", "Anniversary", "Cultural Events"]
            },
            sportsGroundForRent: {
                available: true,
                groundType: "Cricket",
                hourlyRate: 2000
            }
        },
        media: {
            instagram: "https://instagram.com/heritagepalace",
            facebook: "https://facebook.com/heritagepalace",
            website: "https://heritagepalace.com"
        }
    },
    {
        title: "Cozy PG Accommodation",
        description: "Comfortable paying guest accommodation with all basic amenities, perfect for students and working professionals.",
        image: {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            filename: "pg-accommodation.jpg"
        },
        price: 800,
        location: "Bangalore, India",
        country: "India",
        propertyType: "PG",
        pricingPeriod: "per month",
        phone: "+91 9876543214",
        email: "info@pgaccommodation.com",
        bedrooms: "1",
        bathrooms: "1",
        maxGuests: 1,
        checkIn: "12:00",
        checkOut: "12:00",
        amenities: ["WiFi", "Parking", "Kitchen", "TV"],
        paymentMethods: ["UPI", "PhonePe", "Cash on Delivery"],
        upiId: "pgaccommodation@paytm",
        bankAccount: "1234567894",
        owner: new mongoose.Types.ObjectId(),
        services: {
            food: ["Veg", "South Indian"],
            chef: {
                available: true,
                cuisines: ["South Indian", "North Indian"],
                pricePerMeal: 100
            },
            massage: {
                types: [],
                priceList: []
            },
            training: {
                gym: { available: false, monthlyPrice: 0 },
                yoga: { available: false, monthlyPrice: 0 },
                karate: { available: false, monthlyPrice: 0 }
            },
            sports: {
                indoor: ["Chess", "Carrom"],
                outdoor: ["Jogging", "Walking"]
            },
            events: {
                supported: []
            },
            sportsGroundForRent: {
                available: false,
                groundType: "",
                hourlyRate: 0
            }
        },
        media: {
            instagram: "https://instagram.com/pgaccommodation",
            facebook: "https://facebook.com/pgaccommodation",
            website: "https://pgaccommodation.com"
        }
    }
];

async function seedSampleData() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/planmystay');
        console.log('Connected to MongoDB');
        
        // Clear existing listings
        await Listing.deleteMany({});
        console.log('Cleared existing listings');
        
        // Insert sample data
        const insertedListings = await Listing.insertMany(sampleListings);
        console.log('Sample data seeded successfully!');
        console.log(`Inserted ${insertedListings.length} listings`);
        
    } catch (error) {
        console.error('Error seeding sample data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeding function
seedSampleData();
