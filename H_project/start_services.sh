#!/bin/bash
echo "Starting AI-Powered Property Rental Application..."
echo

echo "Starting ML Service on port 5000..."
cd ml_service
python predict.py &
ML_PID=$!

echo "Waiting for ML service to start..."
sleep 5

echo "Starting Node.js Application on port 3000..."
cd ..
npm start &
NODE_PID=$!

echo
echo "Both services are starting..."
echo "ML Service: http://localhost:5000"
echo "Web Application: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both services"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping services..."
    kill $ML_PID 2>/dev/null
    kill $NODE_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait
