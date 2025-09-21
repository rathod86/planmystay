const axios = require('axios');

async function testAIPrediction() {
    try {
        console.log('Testing AI Prediction Service...');
        
        const testData = {
            location: 'mumbai',
            base_price: 150,
            property_type: 'Hotel',
            amenities_score: 80,
            review_rating: 4.5,
            booking_lead_time: 7,
            competitor_price: 160
        };
        
        const response = await axios.post('http://localhost:5000/predict', testData);
        console.log('✅ AI Prediction Response:', response.data);
        
        // Test the web app API
        const webResponse = await axios.post('http://localhost:3000/api/predict-price', testData);
        console.log('✅ Web App API Response:', webResponse.data);
        
    } catch (error) {
        console.error('❌ Error testing AI:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure the ML service is running on port 5000');
        }
    }
}

// Wait a bit for services to start, then test
setTimeout(testAIPrediction, 3000);
