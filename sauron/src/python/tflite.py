# https://www.tensorflow.org/lite/inference_with_metadata/task_library/object_detector#run_inference_in_python
# Imports
from tflite_support.task import vision
from tflite_support.task import core
from tflite_support.task import processor

# Initialization
base_options = core.BaseOptions(file_name=model_path)
detection_options = processor.DetectionOptions(max_results=2)
options = vision.ObjectDetectorOptions(
    base_options=base_options, detection_options=detection_options
)
detector = vision.ObjectDetector.create_from_options(options)

# Alternatively, you can create an object detector in the following manner:
# detector = vision.ObjectDetector.create_from_file(model_path)

# Run inference
image = vision.TensorImage.create_from_file("../image/elephant.jpg")
result = detector.detect(image)
result = {key: value.numpy() for key, value in result.items()}
print(result)
