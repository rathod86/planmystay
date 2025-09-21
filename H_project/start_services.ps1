Write-Host "Starting AI-Powered Property Rental Application..." -ForegroundColor Green
Write-Host ""

# Kill existing processes on ports 3000 and 5000
Write-Host "Killing any existing processes on ports 3000 and 5000..." -ForegroundColor Yellow
$processes3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
$processes5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($processes3000) {
    $processes3000 | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}
if ($processes5000) {
    $processes5000 | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}

Write-Host "Starting ML Service on port 5000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PSScriptRoot\ml_service`" && python predict.py" -WindowStyle Normal

Write-Host "Waiting for ML service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting Node.js Application on port 3000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$PSScriptRoot`" && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "ML Service: http://localhost:5000" -ForegroundColor Blue
Write-Host "Web Application: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
