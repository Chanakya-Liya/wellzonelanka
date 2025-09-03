# WellzoneLanka Backend Setup

## Overview
This backend contains ML-powered exercise tracking APIs for push-ups, squats, planks, and lunges using MediaPipe pose detection.

## Prerequisites
- Python 3.11 (required for MediaPipe compatibility)
- Windows OS

## Quick Start

### 1. Create Virtual Environment
```powershell
# Navigate to project root
cd C:\Users\Chana\Documents\IIT\WellzoneLanka.com

# Create virtual environment with Python 3.11
py -3.11 -m venv .venv

# Activate virtual environment  
.venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
# Install required packages
pip install -r Backend/requirements.txt
```

### 3. Start All APIs
```powershell
# Option 1: Use PowerShell script (starts all APIs at once)
powershell -ExecutionPolicy Bypass -File "Backend/start_apis.ps1"

# Option 2: Start individual APIs manually
cd Backend/ml/apis
python pushup_api.py    # Port 5000
python squat_api.py     # Port 5001  
python plank_api.py     # Port 5002
python lunge_api.py     # Port 5003
```

## API Endpoints

### Exercise Tracking APIs
- **Pushup API**: http://127.0.0.1:5000/
- **Squat API**: http://127.0.0.1:5001/
- **Plank API**: http://127.0.0.1:5002/  
- **Lunge API**: http://127.0.0.1:5003/

Each API provides:
- `/` - Web interface for exercise tracking
- `/video_feed` - Live camera feed with pose detection
- `/home` - Home page
- Real-time exercise counting using MediaPipe

## Architecture

```
Backend/
├── requirements.txt          # Python dependencies
├── start_apis.ps1           # PowerShell script to start all APIs
├── start_apis.py            # Python script to start all APIs
└── ml/
    └── apis/
        ├── pushup_api.py    # Push-up tracking API
        ├── pushup.py        # Push-up pose detection logic
        ├── squat_api.py     # Squat tracking API  
        ├── squat.py         # Squat pose detection logic
        ├── plank_api.py     # Plank tracking API
        ├── plank.py         # Plank pose detection logic
        ├── lunge_api.py     # Lunge tracking API
        └── lunge.py         # Lunge pose detection logic
```

## Dependencies
- Flask 3.1.2 - Web framework
- Flask-CORS 6.0.1 - Cross-origin resource sharing
- OpenCV 4.12.0.88 - Computer vision  
- MediaPipe 0.10.5 - Pose detection
- TensorFlow 2.12.0 - Machine learning
- NumPy 1.23.5 - Numerical computing

## Troubleshooting

### Camera Issues
- Camera errors are normal if no camera is connected
- The APIs will still start and serve web interfaces
- Connect a camera for full functionality

### Port Conflicts  
- If ports are in use, modify the port numbers in each API file
- Default ports: 5000-5003

### Python Version Issues
- MediaPipe requires Python 3.11 or earlier
- Python 3.13 is not compatible with current MediaPipe versions

### Package Installation Issues
```powershell
# Clear pip cache and reinstall
pip cache purge
pip install --no-cache-dir -r Backend/requirements.txt
```

## Development Notes
- APIs use Flask development server (not for production)
- CORS is enabled for frontend integration
- TensorFlow logging is suppressed for cleaner output
- Each API runs independently on different ports
