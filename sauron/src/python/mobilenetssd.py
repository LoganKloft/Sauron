# example of using video: https://github.com/zafarRehan/object_detection_COCO/blob/main/detection_code_video.py
import cv2 as cv

cvNet = cv.dnn.readNetFromTensorflow("frozen_mobilenetssd.pb", "mobilenetssd.pbtxt")

img = cv.imread("../image/elephant.jpg")
rows = img.shape[0]
cols = img.shape[1]
cvNet.setInput(cv.dnn.blobFromImage(img, size=(300, 300), swapRB=True, crop=False))
cvOut = cvNet.forward()

for detection in cvOut[0, 0, :, :]:
    score = float(detection[2])
    if score > 0.6:
        left = detection[3] * cols
        top = detection[4] * rows
        right = detection[5] * cols
        bottom = detection[6] * rows
        cv.rectangle(
            img,
            (int(left), int(top)),
            (int(right), int(bottom)),
            (23, 230, 210),
            thickness=2,
        )

cv.imshow("img", img)
cv.waitKey()
