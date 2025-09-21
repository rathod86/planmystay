@echo off
echo Starting AI-Powered Property Rental Application...
echo.

echo Killing any existing processes on ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F >nul 2>&1

echo Starting ML Service on port 5000...
start "ML Service" cmd /k "cd /d %~dp0ml_service && python predict.py"

echo Waiting for ML service to start...
timeout /t 5 /nobreak > nul

echo Starting Node.js Application on port 3000...
start "Node.js App" cmd /k "cd /d %~dp0 && npm start"

echo.
echo Both services are starting...
echo ML Service: http://localhost:5000
echo Web Application: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
