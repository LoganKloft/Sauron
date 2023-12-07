# Generate Evaluations:

Download the evaluation images from [CrowdHuman](https://drive.google.com/file/d/18jFI789CoHTppQ7vmRSFEdnGaSQZ4YzO/view)

Extract the Images folder into the evaluations folder

run script to convert annotation

```bash
    python format_annotation_val.py
```
 
run each inference script (~2-3 hours total)

```bash
    python efficientdet_inference.py
    python mobilenetssd_inference.py
    python yolo_inference.py
    python fasterrcnn_inference.py
```

run calculate_iou script for each model

```bash
    python calculate_iou.py
```

change lines 13, 81, 87 for the appropriate model

head over to this [collab](https://colab.research.google.com/drive/1rRutPPlbRErqldoFEulO2-7AOzSpq-Sz#scrollTo=mvIKeR_hDsfS) and follow the instructions there
