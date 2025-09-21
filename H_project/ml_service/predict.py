from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime
import requests

app = Flask(__name__)

# Load training data
data = pd.read_csv('pricing_data.csv')

# Feature engineering
X = data[['demand', 'event', 'season', 'competitor_price', 'base_price', 
          'location_score', 'property_type', 'amenities_score', 'review_rating', 
          'booking_lead_time', 'local_events_count', 'weather_conditions', 
          'day_of_week', 'month']]
y = data['price']

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, 'price_model.pkl')
joblib.dump(scaler, 'price_scaler.pkl')

def get_demand_data(location):
    """Get real-time demand data for location"""
    # This would integrate with real APIs in production
    # For now, return mock data based on location
    demand_map = {
        'mumbai': 85,
        'delhi': 80,
        'bangalore': 75,
        'pune': 70,
        'goa': 90
    }
    return demand_map.get(location.lower(), 70)

def get_event_data(location):
    """Get local events data"""
    # Mock event data - in production, integrate with Eventbrite API
    events = {
        'mumbai': {'count': 5, 'major': 1},
        'delhi': {'count': 3, 'major': 0},
        'bangalore': {'count': 4, 'major': 1},
        'pune': {'count': 2, 'major': 0},
        'goa': {'count': 6, 'major': 1}
    }
    return events.get(location.lower(), {'count': 2, 'major': 0})

def get_weather_data(location):
    """Get weather conditions"""
    # Mock weather data - in production, integrate with OpenWeatherMap
    weather_map = {
        'mumbai': 1,  # Good weather
        'delhi': 0,   # Normal weather
        'bangalore': 1,
        'pune': 1,
        'goa': 1
    }
    return weather_map.get(location.lower(), 0)

def get_seasonal_factor():
    """Get current seasonal factor"""
    month = datetime.now().month
    if month in [12, 1, 2]:  # Winter
        return 1
    elif month in [3, 4, 5]:  # Spring
        return 2
    elif month in [6, 7, 8]:  # Summer
        return 3
    else:  # Fall
        return 2

@app.route('/predict', methods=['POST'])
def predict():
    try:
        features = request.json
        
        # Get additional real-time data
        location = features.get('location', 'mumbai').lower()
        demand = get_demand_data(location)
        event_data = get_event_data(location)
        weather = get_weather_data(location)
        season = get_seasonal_factor()
        
        # Prepare feature vector
        feature_vector = [
            demand,
            event_data['major'],
            season,
            features.get('competitor_price', 120),
            features.get('base_price', 100),
            features.get('location_score', 80),
            features.get('property_type', 1),
            features.get('amenities_score', 70),
            features.get('review_rating', 4.0),
            features.get('booking_lead_time', 7),
            event_data['count'],
            weather,
            datetime.now().weekday() + 1,  # day_of_week
            datetime.now().month
        ]
        
        # Scale features
        feature_array = np.array(feature_vector).reshape(1, -1)
        scaled_features = scaler.transform(feature_array)
        
        # Predict price
        predicted_price = model.predict(scaled_features)[0]
        
        # Add confidence score and insights
        confidence = min(95, 70 + (demand - 50) * 0.5)  # Mock confidence calculation
        
        insights = {
            'demand_level': 'High' if demand > 80 else 'Medium' if demand > 60 else 'Low',
            'event_impact': 'High' if event_data['major'] else 'Low',
            'seasonal_factor': 'Peak' if season == 3 else 'Normal',
            'weather_impact': 'Positive' if weather == 1 else 'Neutral'
        }
        
        return jsonify({
            'predicted_price': round(predicted_price, 2),
            'confidence': round(confidence, 1),
            'insights': insights,
            'features_used': {
                'demand': demand,
                'events': event_data,
                'weather': weather,
                'season': season
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)