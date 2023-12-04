import cv2

img = cv2.imread("./Images/273271,c9db000d5146c15.jpg")

# [390.3692932128906, 390.3692932128906, 252.96600341796875, 418.31903076171875]

cv2.rectangle(img, (530, 183), (530 + 258, 183 + 413), color=(255, 0, 0), thickness=3)
cv2.imshow("out", img)
cv2.waitKey()