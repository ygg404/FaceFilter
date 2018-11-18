from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from Code.dlibUint import dlibUint
import base64
import numpy as np
import cv2
import json

# Create your views here.

def Index(request):
    return render(request,'Index.html')


def facedetect(request):
    if request.method=='POST':
        try:
            detector = dlibUint().detector
            predictor = dlibUint().predictor
            imgBase64 = request.POST.get('imgdata')
            img_b64decode = base64.b64decode(imgBase64)
            img_array = np.fromstring(img_b64decode,np.uint8) # 转换np序列
            img=cv2.imdecode(img_array,cv2.COLOR_BGR2GRAY)  # 转换Opencv格式
            rects = detector(img, 1)
            if( len(rects)<1):
                raise Exception("未识别到人脸")
            if len(rects)> 1 :
                raise Exception("请上传个人照片")
            array = np.array([[p.x, p.y] for p in predictor(img, rects[0]).parts()])
            json_dict = \
                {"StatusCode": 1,
                 "message": '',
                 "result": array.tolist()
                 }
        except Exception as e:
            json_dict = \
                {"StatusCode": -1,
                 "message": str(e),
                 "result": ''
                }
            return JsonResponse(json_dict)
    return JsonResponse(json_dict)