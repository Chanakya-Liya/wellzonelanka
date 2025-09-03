#!/usr/bin/env python3
"""
Test script to check if all required dependencies are available
"""

import sys
import subprocess

def check_package(package_name):
    """Check if a package is installed and importable"""
    try:
        __import__(package_name)
        return True, "✅ Available"
    except ImportError as e:
        return False, f"❌ Missing: {str(e)}"

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major == 3 and version.minor <= 11:
        return True, f"✅ Python {version.major}.{version.minor}.{version.micro} (Compatible)"
    else:
        return False, f"❌ Python {version.major}.{version.minor}.{version.micro} (Too new - MediaPipe requires Python ≤ 3.11)"

def main():
    print("🔍 WellzoneLanka API Dependencies Check")
    print("=" * 50)
    
    # Check Python version
    py_ok, py_msg = check_python_version()
    print(f"Python Version: {py_msg}")
    
    # Required packages
    packages = [
        ("flask", "Flask"),
        ("flask_cors", "Flask-CORS"),
        ("cv2", "OpenCV"),
        ("numpy", "NumPy"),
        ("tensorflow", "TensorFlow"),
        ("absl", "Abseil"),
        ("mediapipe", "MediaPipe")
    ]
    
    print("\nPackage Dependencies:")
    all_ok = py_ok
    
    for import_name, display_name in packages:
        ok, msg = check_package(import_name)
        print(f"{display_name:12}: {msg}")
        if not ok:
            all_ok = False
    
    print("\n" + "=" * 50)
    
    if all_ok:
        print("🎉 All dependencies are available! You can run the APIs.")
        print("\nTo start all APIs:")
        print("  python start_apis.py")
        print("  or")
        print("  .\\start_apis.ps1")
    else:
        print("⚠️  Some dependencies are missing or incompatible.")
        print("\n💡 Solutions:")
        
        if not py_ok:
            print("1. Install Python 3.11 or earlier")
            print("2. Create new virtual environment with Python 3.11:")
            print("   py -3.11 -m venv .venv311")
            print("   .venv311\\Scripts\\activate")
        
        print("3. Install missing packages:")
        print("   pip install flask flask-cors opencv-python numpy tensorflow absl-py mediapipe")
        
        print("\n📖 See SETUP.md for detailed instructions")

if __name__ == "__main__":
    main()
