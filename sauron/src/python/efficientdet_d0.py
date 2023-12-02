# from https://github.com/opencv/opencv/pull/17384
import cv2 as cv

net = cv.dnn_DetectionModel("frozen_efficientdet_d0.pb", "efficientdet_d0.pbtxt")
net.setInputSize(512, 512)
net.setInputScale(1.0 / 255)
net.setInputMean((123.675, 116.28, 103.53))

frame = cv.imread("../image/elephant.jpg")

classes, confidences, boxes = net.detect(frame, confThreshold=0.5, nmsThreshold=0.4)
for classId, confidence, box in zip(classes.flatten(), confidences.flatten(), boxes):
    cv.rectangle(frame, box, color=(255, 0, 0), thickness=3)
    cv.rectangle(frame, box, color=(0, 255, 0), thickness=1)

cv.imshow("out", frame)
cv.waitKey()
