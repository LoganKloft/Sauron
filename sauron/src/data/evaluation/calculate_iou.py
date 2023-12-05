import json
# read in gound truths
f = open("annotations.txt")
f_lines = f.readlines()
f.close()

# read in inference values
g = open("mobilenet_inference_70.txt")
g_lines = g.readlines()
g.close()

# box1, box2 = [x, y, w, h]
# x,y define the top left corner
def calcIOU(box1, box2):
    b1 = [box1[0], box1[1], box1[0] + box1[2], box1[1] + box1[3]]
    b2 = [box2[0], box2[1], box2[0] + box2[2], box2[1] + box2[3]]

    i_width = min(b1[2], b2[2]) - max(b1[0], b2[0])
    i_height = min(b1[3], b2[3]) - max(b1[1], b2[1])
    if i_width <= 0 or i_height <= 0: return 0
    i_area = i_width * i_height
    u_area = (box1[2] * box1[3]) + (box2[2] * box2[3]) - i_area
    return i_area / u_area

ious = [.10 * (x + 1) for x in range(9)]
aps = []
recalls = []
for iou in ious:
    s_aps = 0
    s_recalls = 0
    for i in range(len(f_lines)):
        f_line = json.loads(f_lines[i].strip())
        g_line = json.loads(g_lines[i].strip())

        # calculate iou of each value in g_line
        vboxes = f_line["vboxes"]
        boxes = g_line["boxes"]
        accurate = 0
        inaccurate = 0
        expected = len(vboxes)
        for box in boxes:
            flag = False
            for vbox in vboxes:
                if calcIOU(box, vbox) > iou:
                    flag = True
                    break
            
            if flag:
                accurate += 1
            else:
                inaccurate += 1


        # calculate precision of g_line
        # precision: ratio of accurate to inacurrate predictions
        # if no inferences, we give precision of 1
        if accurate + inaccurate == 0:
            s_aps += 1
        else:
            s_aps += accurate / (accurate + inaccurate)

        # calculate recall of g_line
        # ratio of accurate predictions to expected predictions
        # if there are more accurate predictions than there
        # are expected predictions, recall is 1
        # if no inferences, recall is 0 - we assume
        # that every image contains a person
        if accurate + inaccurate != 0:
            s_recalls += min(1, accurate / expected)
        

    aps.append(s_aps / len(f_lines))
    recalls.append(s_recalls / len(f_lines))

# write out results
f = open("mobilenet_ap.txt", "w")
for iou, ap in zip(ious, aps):
    f.write(f"{iou} {ap}\n")
f.close()

f = open("mobilenet_recall.txt", "w")
for iou, rec in zip(ious, recalls):
    f.write(f"{iou} {rec}\n")
f.close()