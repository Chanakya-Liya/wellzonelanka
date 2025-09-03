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

# Add the path of pushup.py
pushup_path = r"./pushup.py"
sys.path.append(pushup_path)

from pushup import PoseDetector  # Import PoseDetector from pushup.py

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
                        <title>Pushup Tracker</title>
                    </head>
                    <body>
                        <h1>Pushup Tracker - Camera Stopped</h1>
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
                    <title>Pushup Tracker</title>
                </head>
                <body>
                    <h1>Pushup Tracker</h1>
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
            <title>Pushup Tracker</title>
        </head>
        <body>
            <h1>Pushup Tracker</h1>
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
                left_elbow = detector.findAngle(img, 11, 13, 15)
                right_elbow = detector.findAngle(img, 12, 14, 16)
                left_shoulder = detector.findAngle(img, 13, 11, 23)
                right_shoulder = detector.findAngle(img, 14, 12, 24)
                left_hip = detector.findAngle(img, 11, 23, 25)
                right_hip = detector.findAngle(img, 12, 24, 26)
                left_knee = detector.findAngle(img, 23, 25, 27)
                right_knee = detector.findAngle(img, 24, 26, 28)
                left_ankle = detector.findAngle(img, 25, 27, 29)
                right_ankle = detector.findAngle(img, 26, 28, 30)

                elbow= (left_elbow and right_elbow) 
                shoulder = (left_shoulder and right_shoulder)
                hip = (left_hip and right_hip)
                

                per = np.interp(elbow, (90, 160), (0, 100))
                bar = np.interp(elbow, (90, 160), (380, 50))

                if elbow > 160 and shoulder > 40 and hip > 160:
                    form = 1

                if form == 1:
                    if elbow <= 90 and hip > 160:
                        feedback = "Down"
                        if direction == 0:
                            count += 0.5
                            direction = 1
                    elif elbow > 160 and shoulder > 40 and hip > 160:
                        feedback = "Up"
                        if direction == 1:
                            count += 0.5
                            direction = 0
                    else:
                        feedback = "Fix Form"

                    # Draw Bar
                    cv2.rectangle(img, (580, 50), (600, 380), (0, 255, 0), 3)
                    cv2.rectangle(img, (580, int(bar)), (600, 380), (0, 255, 0), cv2.FILLED)
                    cv2.putText(img, f'{int(per)}%', (565, 430), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

                # Push-up counter
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
            <h1>Welcome to the Pushup Tracker!</h1>
            <a href="/">Go to Tracker</a>
        </body>
    </html>
    """)

if __name__ == "__main__":
    host = "127.0.0.1"
    port = 5000
    print(f"Flask app running at: http:/{host}:{port}/")
    app.run(host=host, port=port, debug=True)
