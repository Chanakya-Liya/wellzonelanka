import os
import sys
import cv2
import numpy as np
from flask_cors import CORS
from flask import Flask, Response, jsonify, render_template_string, request
import absl.logging
import tensorflow as tf
import math

# Suppress TensorFlow Lite and TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress all logs (info, warnings, errors)
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations
os.environ['TF_LITE_USE_XNNPACK'] = '0'  # Disable TensorFlow Lite XNNPACK optimizations

# Suppress absl log warnings
absl.logging.set_verbosity(absl.logging.FATAL)  # Only fatal errors will be shown

# Add the path of plank.py
plank_path = r"./plank.py"
sys.path.append(plank_path)

from plank import PoseDetector  # Import PoseDetector from pushup.py

app = Flask(__name__)
CORS(app) 

detector = PoseDetector()
cap = cv2.VideoCapture(0)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Handle the button click for stopping the camera feed
        if request.form.get('action') == 'stop_video':
            cap.release()
            return render_template_string("""
                <html>
                    <head>
                        <title>Plank Exercise Tracker</title>
                    </head>
                    <body>
                        <h1>Plank Exercise Tracker - Camera Stopped</h1>
                        <p>Camera feed is stopped. Go back to tracker or home page.</p>
                        <a href="/">Go to Tracker</a><br>
                        <a href="/home">Go to Home Page</a>
                    </body>
                </html>
            """)

        # Return Home Page content if stop video action is not triggered
        return render_template_string("""
            <html>
                <head>
                    <title>Plank Exercise Tracker</title>
                </head>
                <body>
                    <h1>Plank Exercise Tracker</h1>
                    <form method="POST">
                        <button type="submit" name="action" value="stop_video">Stop Video Feed and Go Home</button>
                    </form>
                    <img src="{{ url_for('video_feed') }}" id="video-feed" width="640" height="480" />
                </body>
            </html>
        """)

    # Default GET request response to show the video feed and home page
    return render_template_string("""
    <html>
        <head>
            <title>Plank Exercise Tracker</title>
        </head>
        <body>
            <h1>Plank Exercise Tracker</h1>
            <form method="POST">
                <button type="submit" name="action" value="stop_video">Stop Video Feed and Go Home</button>
            </form>
            <img src="{{ url_for('video_feed') }}" id="video-feed" width="640" height="480" />
        </body>
    </html>
    """)

@app.route('/video_feed')
def video_feed():
    def generate():
        count = 0
        direction = 0
        form = 0
        feedback = "Fix Form"
        
        while True:
            ret, img = cap.read()
            if not ret:
                break

            # Apply pose detection
            img = detector.findPose(img, False)
            lmList = detector.findPosition(img, False)

            if lmList:
                left_shoulder = detector.findAngle(img, 13, 11, 23)
                right_shoulder = detector.findAngle(img, 14, 12, 24)
                left_hip = detector.findAngle(img, 11, 23, 25)
                right_hip = detector.findAngle(img, 12, 24, 26)
                left_ankle = detector.findAngle(img, 23, 25, 27)
                right_ankle = detector.findAngle(img, 24, 26, 28)
                left_knee = detector.findAngle(img, 25, 27, 29)
                right_knee = detector.findAngle(img, 26, 28, 30)

                
                # Extract X-coordinates of key landmarks
                left_shoulder_x = lmList[11][1]
                right_shoulder_x = lmList[12][1]
                left_hip_x = lmList[23][1]
                right_hip_x = lmList[24][1]
                left_ankle_x = lmList[25][1]
                right_ankle_x = lmList[26][1]

                # Calculate the horizontal alignment differences
                shoulder_diff = abs(left_shoulder_x - right_shoulder_x)
                hip_diff = abs(left_hip_x - right_hip_x)
                ankle_diff = abs(left_ankle_x - right_ankle_x)

                # Define threshold for alignment (small differences mean proper plank form)
                threshold = 10  # Adjust based on precision needed

                # Checking if the plank position is correct
                if shoulder_diff < threshold and hip_diff < threshold and ankle_diff < threshold:
                    form = 1  # Proper plank form
                else:
                    form = 0  # Misaligned body

                if form == 1:
                    feedback = "Good Form"
                    count += 1  # Increment plank hold time count
                else:
                    feedback = "Fix Alignment"

                # Plank counter
                cv2.rectangle(img, (0, 380), (100, 480), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, str(int(count)), (25, 455), cv2.FONT_HERSHEY_PLAIN, 5, (255, 0, 0), 5)

                # Feedback
                cv2.rectangle(img, (500, 0), (640, 40), (255, 255, 255), cv2.FILLED)
                cv2.putText(img, feedback, (500, 40), cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 2)

            _, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/home')
def home_page():
    return render_template_string("""
    <html>
        <head>
            <title>Home Page</title>
        </head>
        <body>
            <h1>Welcome to the Plank Exercise Tracker!</h1>
            <a href="/">Go to Tracker</a>
        </body>
    </html>
    """)

if __name__ == "__main__":
    host = "127.0.0.1"
    port = 5002
    print(f"Flask app running at: http:/{host}:{port}/")
    app.run(host=host, port=port, debug=True)
