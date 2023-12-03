# adapted from https://github.com/opencv/opencv/pull/17384
import cv2
import json
import sys

class_labels = [
    "person",
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "backpack",
    "umbrella",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "couch",
    "potted plant",
    "bed",
    "dining table",
    "toilet",
    "tv",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush",
]

# f = open("./src/python/config.json")
f = open("./config.json")
config = json.load(f)["efficientdet_d0"]
f.close()

video = cv2.VideoCapture(config["source"])
total_frames = video.get(cv2.CAP_PROP_FRAME_COUNT)
frame_rate = video.get(cv2.CAP_PROP_FPS)

net = cv2.dnn_DetectionModel("frozen_efficientdet_d0.pb", "efficientdet_d0.pbtxt")
net.setInputSize(512, 512)
net.setInputScale(1.0 / 255)
net.setInputMean((123.675, 116.28, 103.53))

current_frame = 0
stride = config["vid_stride"]
output = dict()

while current_frame < total_frames:
    video.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
    ret, frame = video.read()

    _classes, _confidences, _boxes = net.detect(
        frame, confThreshold=config["conf"], nmsThreshold=0.4
    )

    if len(_classes) > 0:
        for classId, confidence, box in zip(
            _classes.flatten(), _confidences.flatten(), _boxes
        ):
            # print(class_labels[classId], confidence)
            # cv.rectangle(frame, box, color=(255, 0, 0), thickness=3)
            # cv2.rectangle(
            #     frame,
            #     (box[0], box[1]),
            #     (box[0] + box[2], box[1] + box[3]),
            #     color=(255, 0, 0),
            #     thickness=3,
            # )
            # print(box)

            name = class_labels[classId]

            # create entry if not already created
            if name not in output:
                output[name] = dict()
                entry = output[name]
                entry["frames"] = []
                entry["counts"] = []
                entry["boxes"] = []
                entry["confidences"] = []
                entry["timestamps"] = []

            entry = output[name]
            frames = entry["frames"]
            index = 0
            if current_frame not in frames:
                index = len(frames)
                frames.append(current_frame)
            else:
                index = frames.index(current_frame)

            counts = entry["counts"]
            if index == len(counts):
                counts.append(1)
            else:
                counts[index] += 1

            boxes = entry["boxes"]
            if index == len(boxes):
                boxes.append([])

            boxes_entry = dict()
            boxes_entry["x1"] = int(box[0])
            boxes_entry["y1"] = int(box[1])
            boxes_entry["x2"] = int(box[0] + box[2])
            boxes_entry["y2"] = int(box[1] + box[3])
            boxes[index].append(boxes_entry)

            confidences = entry["confidences"]
            if index == len(confidences):
                confidences.append([])

            confidences[index].append(float(confidence))

            timestamps = entry["timestamps"]
            if index == len(timestamps):
                timestamps.append(current_frame / frame_rate)

    print(f"{(current_frame / total_frames) * 100}%")
    # cv2.imshow("out", frame)
    # cv2.waitKey(1)
    current_frame += stride

video.release()
task_name = config["name"]
# with open(f"./src/data/query/{task_name}_results.json", "w") as fp:
with open(f"./{task_name}_results.json", "w") as fp:
    json.dump(output, fp)
