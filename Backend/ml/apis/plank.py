import os
import cv2
import mediapipe as mp
import math
import numpy as np
import tensorflow as tf

# Suppress TensorFlow and MediaPipe warnings
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
tf.get_logger().setLevel("ERROR")

class PoseDetector:
    def __init__(self, mode=False, complexity=1, smooth_landmarks=True,
                 enable_segmentation=False, smooth_segmentation=True,
                 detectionCon=0.5, trackCon=0.5):
        
        self.mode = mode
        self.complexity = complexity
        self.smooth_landmarks = smooth_landmarks
        self.enable_segmentation = enable_segmentation
        self.smooth_segmentation = smooth_segmentation
        self.detectionCon = detectionCon
        self.trackCon = trackCon
        
        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(self.mode, self.complexity, self.smooth_landmarks,
                                     self.enable_segmentation, self.smooth_segmentation,
                                     self.detectionCon, self.trackCon)

    def findPose(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)

        if self.results.pose_landmarks and draw:
            self.mpDraw.draw_landmarks(img, self.results.pose_landmarks,
                                       self.mpPose.POSE_CONNECTIONS)
        return img

    def findPosition(self, img, draw=True):
        self.lmList = []
        if self.results.pose_landmarks:
            h, w, _ = img.shape
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                cx, cy = int(lm.x * w), int(lm.y * h)
                self.lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 0), cv2.FILLED)
        return self.lmList

    def findAngle(self, img, p1, p2, p3, draw=True):
        x1, y1 = self.lmList[p1][1:]
        x2, y2 = self.lmList[p2][1:]
        x3, y3 = self.lmList[p3][1:]

        angle = math.degrees(math.atan2(y3 - y2, x3 - x2) -
                             math.atan2(y1 - y2, x1 - x2))

        if angle < 0:
            angle += 360
        if angle > 180:
            angle = 360 - angle

        if draw:
            cv2.line(img, (x1, y1), (x2, y2), (255, 255, 255), 3)
            cv2.line(img, (x3, y3), (x2, y2), (255, 255, 255), 3)

            cv2.circle(img, (x1, y1), 5, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x2, y2), 5, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x3, y3), 5, (0, 0, 255), cv2.FILLED)

            cv2.putText(img, str(int(angle)), (x2 - 50, y2 + 50),
                        cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2)
        return angle


def main():
    cap = cv2.VideoCapture(0)
    detector = PoseDetector()
    count = 0
    direction = 0
    form = 0
    feedback = "Fix Form"

    while cap.isOpened():
        ret, img = cap.read()
        if not ret:
            break

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

        cv2.imshow('Plank Counter', img)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
