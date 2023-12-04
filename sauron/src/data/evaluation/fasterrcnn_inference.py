# interence for each image
# output is written at the end of inference
# otherwise we perform io after every iteration of inference
import cv2
import json

# load config
f = open("./fasterrcnn_inference_config.json")
config = json.load(f)
f.close()

# load image names
image_names = []
f = open("./image_names.txt")
lines = f.readlines()
for line in lines:
    line = line.strip()
    image_names.append(line)
f.close()

# load out file
conf = config["conf"]
f = open(f"fasterrcnn_inference_{int(conf * 100)}.txt", "w")

# load model
net = cv2.dnn_DetectionModel(
    "../../python/frozen_faster_rcnn.pb", "../../python/faster_rcnn.pbtxt"
)
net.setInputSize(600, 600)
net.setInputSwapRB(True)
net.setInputCrop(False)

outs = []
base_path = "./Images/"
current_iter = 1
for image_name in image_names:
    img = cv2.imread(base_path + image_name + ".jpg")
    out = {
        "id": image_name,
        "boxes": []
    }

    classes, confidences, boxes = net.detect(img, confThreshold=config["conf"], nmsThreshold=0.4)

    if len(classes) > 0:
        for classId, confidence, box in zip(
            classes.flatten(), confidences.flatten(), boxes
        ):
            if classId == 0:
                # only process inferences of people
                out["boxes"].append([int(box[0]), int(box[1]), int(box[2]), int(box[3])])

    outs.append(out)
    print(f"Progress: {(current_iter / 4370) * 100}%")
    current_iter += 1

for out in outs:
    f.write(json.dumps(out) + "\n")

f.close()