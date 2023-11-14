from ultralytics import YOLO
import cv2
import json
import sys

# paths start in the sauron folder
f = open("./src/python/config.json")
config = json.load(f)["yolo"]
f.close()
model = YOLO(config["weights"].lower())

# get frame count and frame rate
# using the frame rate and current frame we can
# get the time stamp
video = cv2.VideoCapture(config["source"])
total_frames = video.get(cv2.CAP_PROP_FRAME_COUNT)
frame_rate = video.get(cv2.CAP_PROP_FPS)
video.release()


def on_predict_batch_end(predictor):
    one, two, three, four = predictor.batch
    print("START THREE", two, "END THREE")


# model.add_callback("on_predict_batch_end", on_predict_batch_end)

results = model(
    source=config["source"],
    conf=config["conf"],
    vid_stride=config["vid_stride"],
    stream=config["stream"],
    save=config["save"],
    name=config["name"],
    project=config["project"],
)

frame = config["vid_stride"]
output = dict()
for result in results:
    bxes = result.boxes
    for box in bxes:
        name = result.names[box.cls.item()]

        # create entry if not already created
        if name not in output:
            output[name] = dict()
            entry = output[name]
            entry["frames"] = []
            entry["counts"] = []
            entry["boxes"] = []
            entry["confidences"] = []

        entry = output[name]
        frames = entry["frames"]
        index = 0
        if frame not in frames:
            index = len(frames)
            frames.append(frame)
        else:
            index = frames.index(frame)

        counts = entry["counts"]
        if index == len(counts):
            counts.append(1)
        else:
            counts[index] += 1

        boxes = entry["boxes"]
        if index == len(boxes):
            boxes.append([])

        boxes_entry = dict()
        boxes_entry["x1"] = box.xyxy[0][0].item()
        boxes_entry["y1"] = box.xyxy[0][1].item()
        boxes_entry["x2"] = box.xyxy[0][2].item()
        boxes_entry["y2"] = box.xyxy[0][3].item()
        boxes[index].append(boxes_entry)

        confidences = entry["confidences"]
        if index == len(confidences):
            confidences.append([])

        confidences[index].append(box.conf.item())

    print(int((frame / total_frames) * 100))
    sys.stdout.flush()
    frame += config["vid_stride"]

task_name = config["name"]
with open(f"./src/data/query/{task_name}_results.json", "w") as fp:
    json.dump(output, fp)
