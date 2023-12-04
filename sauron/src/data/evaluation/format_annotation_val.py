import json

# Attention fellow scholar(s)
# run this command to create:
# annotations.txt and image_names.txt
# annotations.txt is used in evaluation
# image_names.txt is used in inference
# bounding boxes are in the form [x, y, w, h]
# note that it's important that the order of
# annotations.txt and image_names are the same

# read in all lines from downloaded annotation document
annotations_document = open("./annotation_val.odgt")
lines = annotations_document.readlines()
annotations_document.close()

# open new file that we will reformat annotations to
annotations_document = open("./annotations.txt", "w")

# open new file to extract image names
image_names = open("image_names.txt", "w")

# fbox = full-body bounding-box
# hbox = head bounding-box
# vbox = human-visible bounding-box

for line in lines:
    line = line.strip()
    annotation = json.loads(line)

    anno_id = annotation["ID"]
    anno_gtboxes = annotation["gtboxes"]
    anno_fboxes = []
    anno_hboxes = []
    anno_vboxes = []

    for gtbox in anno_gtboxes:
        fbox = gtbox["fbox"]
        hbox = gtbox["hbox"]
        vbox = gtbox["vbox"]

        anno_fboxes.append(fbox)
        anno_hboxes.append(hbox)
        anno_vboxes.append(vbox)
    
    annotation = {
        "id": anno_id,
        "fboxes": anno_fboxes,
        "hboxes": anno_hboxes,
        "vboxes": anno_vboxes
    }

    annotations_document.write(json.dumps(annotation) + "\n")
    image_names.write(anno_id + "\n")

annotations_document.close()
image_names.close()