from ultralytics import YOLO
import sys
import json

# load config
f = open("./yolo_inference_config.json")
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
f = open(f"yolo_inference_{int(conf * 100)}.txt", "w")

# load model
model = YOLO("yolov8n.pt")

outs = []
base_path = "./Images/"
current_iter = 1
for image_name in image_names:
    out = {
        "id": image_name,
        "boxes": []
    }

    result = model.predict(base_path + image_name + ".jpg", conf=config["conf"], classes=[0])[0]
    for box in result.boxes:
        out["boxes"].append([int(box.xyxy[0][0].item()), int(box.xyxy[0][1].item()), int(box.xyxy[0][2].item() - box.xyxy[0][0].item()), int(box.xyxy[0][3].item() - box.xyxy[0][1].item())])
    
    outs.append(out)
    f.write(json.dumps(out) + "\n")
    print(f"Progress: {(current_iter / 4370) * 100}%")
    current_iter += 1

f.close()