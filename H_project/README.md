# AI-Powered Property Rental Platform

A comprehensive property rental platform with AI-powered price prediction and demand analysis.

## 🚀 Features

### Core Features
- **Property Listings**: Create, edit, and manage property listings
- **User Authentication**: Sign up, login, and user management
- **Image Upload**: Cloudinary integration for image storage
- **Reviews System**: Rate and review properties
- **Search & Filter**: Find properties by location, type, and price

### AI-Powered Features
- **Smart Price Prediction**: ML-based price suggestions using Random Forest
- **Demand Analysis**: Real-time demand level assessment
- **Event Impact**: Local events and festivals impact on pricing
- **Seasonal Trends**: Weather and seasonal factor analysis
- **Competitor Analysis**: Market-based pricing insights
- **Confidence Scoring**: AI prediction confidence levels

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Passport.js** for authentication
- **Cloudinary** for image storage
- **Joi** for validation

### AI/ML
- **Python Flask** for ML service
- **Scikit-learn** Random Forest Regressor
- **Pandas** for data processing
- **Real-time data integration**

### Frontend
- **EJS** templating engine
- **Bootstrap 5** for responsive design
- **JavaScript** for interactive features
- **Mapbox** for location services

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python 3.7+
- MongoDB
- Cloudinary account (for image storage)
- Mapbox account (for maps)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
cd H_project
npm install
cd ml_service
pip install flask pandas scikit-learn joblib
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
SECRET=your-secret-key
MAP_TOKEN=your-mapbox-token
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### 3. Start Services

#### Option 1: Using Scripts
**Windows:**
```bash
start_services.bat
```

**Linux/Mac:**
```bash
chmod +x start_services.sh
./start_services.sh
```

#### Option 2: Manual Start
**Terminal 1 (ML Service):**
```bash
cd ml_service
python predict.py
```

**Terminal 2 (Web App):**
```bash
npm start
```

### 4. Access Application
- **Web Application**: http://localhost:3000
- **ML Service**: http://localhost:5000
- **ML Health Check**: http://localhost:5000/health

## 🤖 AI Features Explained

### Price Prediction Model
The AI system uses a Random Forest Regressor trained on:
- **Demand Level**: Real-time demand indicators
- **Event Impact**: Local events and festivals
- **Seasonal Factors**: Weather and seasonal trends
- **Property Features**: Type, amenities, location score
- **Market Data**: Competitor pricing and reviews

### Real-time Data Sources
- **Demand Data**: Location-based demand indicators
- **Event Data**: Local events and festivals (mock data)
- **Weather Data**: Weather conditions impact
- **Seasonal Data**: Historical booking patterns

### Confidence Scoring
- **High Confidence (80-95%)**: Strong market data and clear patterns
- **Medium Confidence (60-79%)**: Moderate data availability
- **Low Confidence (40-59%)**: Limited data or unusual conditions

## 📁 Project Structure

```
H_project/
├── controllers/          # Route controllers
├── models/              # Database models
├── routes/              # Express routes
├── views/               # EJS templates
├── utils/               # Utility functions
├── public/              # Static assets
├── ml_service/          # Python ML service
│   ├── predict.py       # ML prediction API
│   └── pricing_data.csv # Training data
└── start_services.*     # Startup scripts
```

## 🔧 API Endpoints

### Web Application
- `GET /` - Home page
- `GET /listings` - All listings
- `POST /listings` - Create listing (with AI prediction)
- `GET /listings/:id` - View listing (with AI insights)
- `POST /api/predict-price` - Get AI price prediction

### ML Service
- `POST /predict` - Get price prediction
- `GET /health` - Service health check

## 🎯 Usage Guide

### Creating a Listing with AI
1. Go to "Add new listing"
2. Fill in property details
3. Click "Get AI Price Suggestion"
4. Review AI insights and suggested price
5. Create listing with AI data

### Viewing AI Insights
1. Open any listing
2. View AI Price Insights panel
3. See demand level, event impact, seasonal factors
4. Check confidence score and recommendations

## 🐛 Troubleshooting

### Common Issues

**ML Service Not Starting:**
- Check Python dependencies: `pip install -r requirements.txt`
- Ensure port 5000 is available
- Check Python version (3.7+ required)

**Database Connection Issues:**
- Ensure MongoDB is running
- Check connection string in app.js
- Verify database name 'wanderlust'

**Image Upload Issues:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file format

**AI Predictions Not Working:**
- Check ML service is running on port 5000
- Verify API endpoint connectivity
- Check browser console for errors

## 🔮 Future Enhancements

- **Real API Integrations**: Eventbrite, OpenWeatherMap, competitor scraping
- **Advanced ML Models**: Deep learning, time series analysis
- **Dynamic Pricing**: Real-time price adjustments
- **Analytics Dashboard**: Host performance metrics
- **Mobile App**: React Native mobile application
- **Multi-language Support**: Internationalization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🚀**
