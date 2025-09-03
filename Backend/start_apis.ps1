# PowerShell script to start all ML Exercise APIs
Write-Host "Starting WellzoneLanka ML Exercise APIs..." -ForegroundColor Green
Write-Host "=" * 50

$pythonExe = "C:/Users/Chana/Documents/IIT/WellzoneLanka.com/.venv/Scripts/python.exe"
$apiPath = "C:/Users/Chana/Documents/IIT/WellzoneLanka.com/Backend/ml/apis"

# Check if virtual environment python exists
if (-not (Test-Path $pythonExe)) {
    Write-Host "Virtual environment not found! Please run: py -3.11 -m venv .venv" -ForegroundColor Red
    Write-Host "Then install packages: pip install flask flask-cors opencv-python mediapipe tensorflow" -ForegroundColor Red
    exit 1
}

# Start APIs in separate processes
Write-Host "Starting Pushup API on port 5000..." -ForegroundColor Cyan
Start-Process -FilePath $pythonExe -ArgumentList "$apiPath/pushup_api.py" -WorkingDirectory $apiPath

Start-Sleep -Seconds 2

Write-Host "Starting Squat API on port 5001..." -ForegroundColor Cyan  
Start-Process -FilePath $pythonExe -ArgumentList "$apiPath/squat_api.py" -WorkingDirectory $apiPath

Start-Sleep -Seconds 2

Write-Host "Starting Plank API on port 5002..." -ForegroundColor Cyan
Start-Process -FilePath $pythonExe -ArgumentList "$apiPath/plank_api.py" -WorkingDirectory $apiPath

Start-Sleep -Seconds 2

Write-Host "Starting Lunge API on port 5003..." -ForegroundColor Cyan
Start-Process -FilePath $pythonExe -ArgumentList "$apiPath/lunge_api.py" -WorkingDirectory $apiPath

Write-Host ""
Write-Host "=" * 50
Write-Host "APIs Started! Access them at:" -ForegroundColor Green
Write-Host "- Pushup API: http://127.0.0.1:5000/" -ForegroundColor White
Write-Host "- Squat API:  http://127.0.0.1:5001/" -ForegroundColor White  
Write-Host "- Plank API:  http://127.0.0.1:5002/" -ForegroundColor White
Write-Host "- Lunge API:  http://127.0.0.1:5003/" -ForegroundColor White
Write-Host "=" * 50

Write-Host "All APIs have been started in separate processes!" -ForegroundColor Green
Write-Host "To stop the APIs, close their individual terminal windows or use Task Manager" -ForegroundColor Yellow
