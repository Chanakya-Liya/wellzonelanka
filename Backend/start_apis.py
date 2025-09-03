#!/usr/bin/env python3
"""
Main script to run all ML exercise APIs concurrently.
This will start all four exercise tracking APIs:
- Pushup API on port 5000
- Squat API on port 5001
- Plank API on port 5002
- Lunge API on port 5003
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def run_api(api_file, api_name):
    """Run a single API in a subprocess"""
    try:
        print(f"Starting {api_name}...")
        # Get the absolute path to the API file
        api_path = Path(__file__).parent / "ml" / "apis" / api_file
        
        # Use the virtual environment Python executable
        python_exe = Path(__file__).parent.parent / ".venv" / "Scripts" / "python.exe"
        if not python_exe.exists():
            # Fallback to system python if venv doesn't exist
            python_exe = "python"
        
        process = subprocess.Popen([
            str(python_exe), 
            str(api_path)
        ], cwd=api_path.parent)
        
        print(f"✅ {api_name} started successfully")
        return process
    except Exception as e:
        print(f"❌ Error starting {api_name}: {e}")
        return None

def main():
    print("🚀 Starting WellzoneLanka ML Exercise APIs...")
    print("=" * 50)
    
    # Define APIs and their details
    apis = [
        ("pushup_api.py", "Pushup API (Port 5000)"),
        ("squat_api.py", "Squat API (Port 5001)"),
        ("plank_api.py", "Plank API (Port 5002)"),
        ("lunge_api.py", "Lunge API (Port 5003)")
    ]
    
    processes = []
    
    # Start all APIs
    for api_file, api_name in apis:
        process = run_api(api_file, api_name)
        if process:
            processes.append((process, api_name))
        time.sleep(1)  # Small delay between starting APIs
    
    print("\n" + "=" * 50)
    print("📊 API Status:")
    print("- Pushup API: http://127.0.0.1:5000/")
    print("- Squat API:  http://127.0.0.1:5001/")
    print("- Plank API:  http://127.0.0.1:5002/")
    print("- Lunge API:  http://127.0.0.1:5003/")
    print("=" * 50)
    
    if not processes:
        print("❌ No APIs started successfully")
        return
    
    try:
        print(f"✅ {len(processes)} API(s) running successfully!")
        print("Press Ctrl+C to stop all APIs...")
        
        # Wait for all processes
        for process, name in processes:
            process.wait()
            
    except KeyboardInterrupt:
        print("\n🛑 Stopping all APIs...")
        for process, name in processes:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ {name} stopped")
            except:
                process.kill()
                print(f"🔪 {name} force-killed")
        print("👋 All APIs stopped successfully!")

if __name__ == "__main__":
    main()
