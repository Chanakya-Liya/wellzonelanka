# WellzoneLanka.com
**Health & Fitness Tracker with AI-Powered Exercise Recognition**

Welcome to WellZone Lanka - A comprehensive health and fitness tracking platform featuring real-time exercise detection using computer vision and machine learning.

## 🏗️ Project Structure

```
WellzoneLanka.com/
├── Frontend/                 # Next.js React application
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable React components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── Backend/                 # Python ML APIs
│   ├── ml/apis/            # Exercise tracking APIs
│   ├── requirements.txt    # Python dependencies
│   ├── start_apis.ps1      # PowerShell startup script
│   └── README.md           # Backend-specific setup
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11** (Required - MediaPipe compatibility issue with 3.13+)
- **Node.js 18+** 
- **Windows OS** (Current setup optimized for Windows)
- **Camera** (Optional - for live exercise tracking)

### Backend Setup (AI Exercise APIs)

1. **Create Python Virtual Environment**
   ```powershell
   # Navigate to project root
   cd [Filepath]\WellzoneLanka.com
   
   # Create virtual environment with Python 3.11 (IMPORTANT!)
   py -3.11 -m venv .venv
   
   # Activate virtual environment
   .venv\Scripts\Activate.ps1
   ```

2. **Install Python Dependencies**
   ```powershell
   # Install all required packages
   pip install -r Backend/requirements.txt
   ```

3. **Start All APIs**
   ```powershell
   # Option 1: Start all APIs at once (Recommended)
   powershell -ExecutionPolicy Bypass -File "Backend/start_apis.ps1"
   
   # Option 2: Start individual APIs
   cd Backend/ml/apis
   python pushup_api.py    # Port 5000
   python squat_api.py     # Port 5001
   python plank_api.py     # Port 5002
   python lunge_api.py     # Port 5003
   ```

### Frontend Setup (Next.js App)

1. **Install Node Dependencies**
   ```powershell
   cd Frontend
   npm install
   ```

2. **Start Development Server**
   ```powershell
   npm run dev
   ```

## 🔗 API Endpoints

Once the backend is running, you can access:

- **Pushup API**: http://127.0.0.1:5000/
- **Squat API**: http://127.0.0.1:5001/  
- **Plank API**: http://127.0.0.1:5002/
- **Lunge API**: http://127.0.0.1:5003/

Each API provides:
- `/` - Web interface for exercise tracking
- `/video_feed` - Live camera feed with pose detection
- `/home` - API home page

## 🛠️ Technology Stack

### Backend (AI/ML)
- **Python 3.11** - Programming language
- **Flask** - Web framework for APIs
- **MediaPipe** - Google's pose detection library
- **OpenCV** - Computer vision processing
- **TensorFlow** - Machine learning framework
- **NumPy** - Numerical computing

### Frontend  
- **Next.js** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Database ORM

## 🔧 Troubleshooting

### Python Version Issues
**Problem**: MediaPipe installation fails or imports error
**Solution**: Must use Python 3.11 - MediaPipe is not compatible with Python 3.13+

```powershell
# Check Python versions available
py -0

# Ensure you're using 3.11
py -3.11 --version
```

### Camera/Video Issues
**Problem**: Camera errors in console
**Solution**: Normal if no camera connected. APIs still work for web interfaces.

### Port Conflicts
**Problem**: Address already in use errors
**Solution**: Modify port numbers in individual API files or kill existing processes

```powershell
# Check what's using the ports
netstat -ano | findstr :5000
netstat -ano | findstr :5001
```

### Package Installation Issues
```powershell
# Clear pip cache and reinstall
pip cache purge
pip uninstall -y flask flask-cors opencv-python mediapipe tensorflow
pip install -r Backend/requirements.txt
```

## 📋 Step-by-Step Setup (What We Just Accomplished)

### The Setup Process We Completed:

#### 1. **Identified Python Version Compatibility Issue**
   - **Problem**: Python 3.13 was causing MediaPipe import errors
   - **Root Cause**: MediaPipe 0.10.x requires Python 3.11 or earlier
   - **Solution**: Switched to Python 3.11 virtual environment

#### 2. **Resolved Virtual Environment**
   ```powershell
   # Removed incompatible Python 3.13 environment
   Remove-Item -Recurse -Force .venv
   
   # Created new Python 3.11 environment
   py -3.11 -m venv .venv
   ```

#### 3. **Installed Compatible Package Versions**
   - **TensorFlow 2.12.0** (compatible with MediaPipe 0.10.5)
   - **MediaPipe 0.10.5** (works with Python 3.11)
   - **Protobuf 3.20.3** (resolves version conflicts)
   - **Flask 3.1.2 + Flask-CORS 6.0.1** (web framework)
   - **OpenCV 4.12.0.88** (computer vision)

#### 4. **Configured VS Code Python Environment**
   ```
   Environment Type: VirtualEnvironment
   Python Version: 3.11.9
   Path: [Filepath]/WellzoneLanka.com/.venv/Scripts/python.exe
   ```

#### 5. **Successfully Started All APIs**
   - ✅ **Pushup API**: Port 5000 (Status 200)
   - ✅ **Squat API**: Port 5001 (Status 200)  
   - ✅ **Plank API**: Port 5002 (Status 200)
   - ✅ **Lunge API**: Port 5003 (Status 200)

#### 6. **Created Automation Scripts**
   - `Backend/start_apis.ps1` - PowerShell script to start all APIs
   - `Backend/start_apis.py` - Python alternative startup script
   - `Backend/requirements.txt` - Pinned working package versions

#### 7. **Verified Functionality**
   ```powershell
   # Tested each API endpoint
   Invoke-WebRequest -Uri "http://127.0.0.1:5000/" # ✅ Success
   Invoke-WebRequest -Uri "http://127.0.0.1:5001/" # ✅ Success
   Invoke-WebRequest -Uri "http://127.0.0.1:5002/" # ✅ Success
   ```

### Key Lessons Learned:
1. **Python version compatibility is critical** for ML libraries
2. **MediaPipe has strict requirements** - Python 3.11 max
3. **Package version conflicts** require careful dependency management
4. **TensorFlow/Protobuf versions** must align with MediaPipe
5. **Virtual environments** are essential for reproducible setups

## 🎯 Features

- **Real-time Exercise Detection**: AI-powered pose estimation using MediaPipe
- **Multiple Exercise Types**: Push-ups, squats, planks, lunges  
- **Live Camera Feed**: Real-time video processing and pose tracking
- **Web Interface**: Browser-based exercise tracking with visual feedback
- **RESTful APIs**: Easy integration with frontend applications
- **Cross-Origin Support**: CORS enabled for frontend communication

## 📊 API Response Format

Each exercise API returns structured data:

```json
{
  "exercise_count": 15,
  "current_stage": "up",
  "accuracy": 0.85,
  "timestamp": "2025-09-04T01:23:45Z"
}
```

## 🔒 Security Notes

- APIs currently run in development mode
- No authentication implemented (add for production)
- Camera access requires user permission
- CORS enabled for all origins (restrict for production)

## 📝 Development Notes

- **Flask Development Server**: Not production-ready, use Gunicorn/uWSGI for deployment
- **Database**: Consider adding SQLite/PostgreSQL for data persistence
- **Logging**: TensorFlow logs suppressed for cleaner console output
- **Error Handling**: Basic error handling implemented, expand as needed
- **Testing**: Add unit tests for pose detection algorithms

## 🔄 CI/CD Recommendations

For production deployment:

```yaml
# Example GitHub Actions workflow
- name: Setup Python 3.11
  uses: actions/setup-python@v4
  with:
    python-version: '3.11'
    
- name: Install dependencies
  run: pip install -r Backend/requirements.txt
  
- name: Test APIs
  run: python -m pytest Backend/tests/
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow Python PEP 8 style guidelines
4. Add tests for new functionality
5. Update documentation
6. Commit changes (`git commit -m 'Add AmazingFeature'`)
7. Push to branch (`git push origin feature/AmazingFeature`)
8. Open Pull Request

## 📄 License

This project is part of an academic/educational initiative for health and fitness tracking.

---

**Need Help?** 
- Check `Backend/README.md` for detailed backend setup instructions
- Review terminal output for specific error messages
- Ensure Python 3.11 is installed: `py -3.11 --version`
- Verify all packages installed: `pip list | grep mediapipe`

**Quick Test Commands:**
```powershell
# Test Python environment
[Filepath]/WellzoneLanka.com/.venv/Scripts/python.exe -c "import mediapipe; print('✅ MediaPipe OK')"

# Test API endpoints
$apis = @(5000,5001,5002,5003); $apis | ForEach-Object { try { Invoke-WebRequest "http://127.0.0.1:$_/" -TimeoutSec 5 | Select StatusCode } catch { "Port $_ Error" } }
```
