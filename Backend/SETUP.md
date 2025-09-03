# Setup Instructions for WellzoneLanka ML APIs

⚠️ **Important Compatibility Note**: These APIs require Python 3.11 or earlier. Python 3.13 is not yet supported by MediaPipe.

## Option 1: Install Python 3.11 (Recommended)

1. Download and install Python 3.11 from https://www.python.org/downloads/
2. Create a new virtual environment with Python 3.11:
   ```powershell
   py -3.11 -m venv .venv311
   .venv311\Scripts\activate
   ```
3. Install requirements:
   ```powershell
   pip install -r requirements.txt
   ```

## Option 2: Use System Python (if you have Python 3.11 or earlier)

If your system Python is 3.11 or earlier:
```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Required Packages

- flask==2.3.3
- flask-cors==4.0.0
- opencv-python==4.8.1.78
- numpy==1.24.4
- tensorflow==2.13.0
- absl-py==2.0.0
- mediapipe==0.10.7

## Running the APIs

Once you have the correct Python version and packages installed:

### Start All APIs at Once:
```powershell
# Using PowerShell script
.\start_apis.ps1

# Or using Python script
python start_apis.py
```

### Start Individual APIs:
```powershell
python pushup_api.py    # Port 5000
python squat_api.py     # Port 5001
python plank_api.py     # Port 5002
python lunge_api.py     # Port 5003
```

## API Endpoints

- **Pushup API**: http://127.0.0.1:5000/
- **Squat API**: http://127.0.0.1:5001/
- **Plank API**: http://127.0.0.1:5002/
- **Lunge API**: http://127.0.0.1:5003/

## Troubleshooting

### MediaPipe Not Found Error
This usually means you're using Python 3.13 which is not supported. Downgrade to Python 3.11.

### Camera Permission Issues
Make sure your system allows camera access for Python applications.

### Port Already in Use
If you get port conflicts, you can modify the port numbers in the respective API files.

## Development

For development, make sure to:
1. Use Python 3.11 virtual environment
2. Install all dependencies from requirements.txt
3. Test camera functionality before running pose detection
4. Each API runs independently on different ports
