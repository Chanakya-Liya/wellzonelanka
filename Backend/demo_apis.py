"""
Demo API Server - WellzoneLanka Exercise APIs
This is a demo version that runs without MediaPipe for testing purposes.
For full functionality, install Python 3.11 and MediaPipe.
"""

import os
from flask import Flask, jsonify, render_template_string
from flask_cors import CORS

# Create Flask apps for each exercise
def create_demo_app(exercise_name, port):
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/')
    def index():
        return render_template_string(f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{exercise_name.title()} Tracker - Demo Mode</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
                .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ text-align: center; color: #2c3e50; margin-bottom: 30px; }}
                .status {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                .feature {{ background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 10px 0; }}
                .setup-link {{ background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }}
                .api-info {{ background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                code {{ background: #f1f2f6; padding: 2px 6px; border-radius: 3px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏋️ {exercise_name.title()} Tracker API</h1>
                    <p>WellzoneLanka Exercise Monitoring System</p>
                </div>
                
                <div class="status">
                    <h3>⚠️ Demo Mode Active</h3>
                    <p>This API is running in demo mode because MediaPipe is not available with Python 3.13.</p>
                    <p>For full pose detection functionality, please use Python 3.11 or earlier.</p>
                </div>
                
                <div class="feature">
                    <h3>🎯 What This API Would Do:</h3>
                    <ul>
                        <li>Real-time {exercise_name} pose detection using MediaPipe</li>
                        <li>Count repetitions automatically</li>
                        <li>Provide form feedback</li>
                        <li>Stream video with pose landmarks</li>
                        <li>RESTful endpoints for integration</li>
                    </ul>
                </div>
                
                <div class="api-info">
                    <h3>📡 API Information:</h3>
                    <p><strong>Service:</strong> {exercise_name.title()} Tracking API</p>
                    <p><strong>Port:</strong> {port}</p>
                    <p><strong>Status:</strong> Running (Demo Mode)</p>
                    <p><strong>Framework:</strong> Flask with CORS enabled</p>
                </div>
                
                <div class="setup-link">
                    <h3>🛠️ Want Full Functionality?</h3>
                    <p>Follow the setup instructions in <strong>SETUP.md</strong> to install Python 3.11 and MediaPipe</p>
                    <p>Then restart this API for complete pose detection features</p>
                </div>
            </div>
        </body>
        </html>
        """)
    
    @app.route('/status')
    def status():
        return jsonify({
            "service": f"{exercise_name} API",
            "status": "running",
            "mode": "demo",
            "port": port,
            "features_available": False,
            "message": "MediaPipe not available - install Python 3.11 for full functionality"
        })
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "mode": "demo"})
    
    return app

def start_demo_servers():
    """Start all demo servers"""
    import threading
    import time
    
    exercises = [
        ("pushup", 5000),
        ("squat", 5001), 
        ("plank", 5002),
        ("lunge", 5003)
    ]
    
    print("🚀 Starting WellzoneLanka Exercise APIs (Demo Mode)")
    print("=" * 60)
    print("⚠️  MediaPipe not available - running in demo mode")
    print("📖 See SETUP.md for full installation instructions")
    print("=" * 60)
    
    threads = []
    
    for exercise, port in exercises:
        def run_server(ex_name, p):
            app = create_demo_app(ex_name, p)
            print(f"✅ {ex_name.title()} API started on http://127.0.0.1:{p}/")
            app.run(host="127.0.0.1", port=p, debug=False, threaded=True)
        
        thread = threading.Thread(target=run_server, args=(exercise, port))
        thread.daemon = True
        thread.start()
        threads.append(thread)
        time.sleep(0.5)
    
    print("\n🌐 All APIs are now running:")
    for exercise, port in exercises:
        print(f"   • {exercise.title()}: http://127.0.0.1:{port}/")
    
    print("\n💡 Press Ctrl+C to stop all servers")
    
    try:
        # Keep main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping all servers...")
        print("👋 Goodbye!")

if __name__ == "__main__":
    start_demo_servers()
