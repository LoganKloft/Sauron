
# Sauron

Object Detection made easy. Simply upload a video, wait for it to process, then conveniently query for more than 60 labels within the video.


## Run Locally

Clone the project

```bash
  git clone https://github.com/LoganKloft/Sauron
```

Go to the project directory

```bash
  cd Sauron/sauron
```

Install dependencies

```bash
  npm install
```

Go to the python directory

```bash
  cd src/python
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Go back to the project directory

```bash
cd ../..
```

Install Faster RCNN ResNet50
[download and unzip](http://download.tensorflow.org/models/object_detection/faster_rcnn_resnet50_coco_2018_01_28.tar.gz) from [here](https://github.com/opencv/opencv/wiki/TensorFlow-Object-Detection-API)

rename 'frozen_inference_graph.pb' to 'frozen_faster_rcnn.pb' and paste into Sauron/sauron/src/python directory


Start the server

```bash
  npm run start
```


## Authors

- [@LoganKloft](https://github.com/LoganKloft)
- [@destructioneering](https://github.com/destructioneering)
- [@jeremiah9020](https://github.com/jeremiah9020)

## Colab Resources

- [Evaluation Colab](https://colab.research.google.com/drive/1rRutPPlbRErqldoFEulO2-7AOzSpq-Sz#scrollTo=mvIKeR_hDsfS)
- [Sauron Setup + Demonstration Colab](https://colab.research.google.com/drive/1Kt0UP4yzwde8QoaJDoojH1KJUeuwa87C#scrollTo=a1MDEZvCHhpe)
- [Presentation Slides](https://docs.google.com/presentation/d/14QxLX-CIKX8acvAwU6JBma2ym4PzdAtkcSdqhYwfhLE/edit#slide=id.g2a33ae7451d_0_10)
- [Written Report](https://docs.google.com/document/d/1W0cJ2Gu5Oxt5V1Ky534hDePS0ecDq_8XQd4wN35R1RE/edit?usp=drive_link)
- [Video demonstration](https://drive.google.com/file/d/15yfF_ZCs7ZFZP3pbg3GXBXSt8gDnJxiV/view?usp=drive_link)
- [Custom Training Script](https://drive.google.com/file/d/1xwQ5H7FAB3wugdjbzFlcPl_en-Wkbftc/view?usp=drive_link)
