from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from Code.BaiduTokenUint import BaiduPicIndentify
import base64
import json
import requests


def Index(request):
    return render(request,'beauty.html')

def beautydetect(request):
    if request.method=='POST':
        try:
            # 人脸检测与属性分析
            img_BASE64 = request.POST.get('imgdata')
            request_url = "https://aip.baidubce.com/rest/2.0/face/v3/detect"
            post_data = {
                "image": img_BASE64,
                "image_type": "BASE64",
                "face_field": "gender,age,beauty,gender,race,expression",
                "face_type": "LIVE"
            }
            if  BaiduPicIndentify().access_token == '':
                BaiduPicIndentify().get_accessToken()
            access_token = BaiduPicIndentify().access_token
            request_url = request_url + "?access_token=" + access_token
            response = requests.post(url=request_url, data=post_data, headers=BaiduPicIndentify().headers)
            json_result = json.loads(response.text)
        except Exception as e:
            json_dict = \
                {"StatusCode": -1,
                 "message": str(e),
                 "result": ''
                }
            return JsonResponse(json_dict)
    return JsonResponse(json_result)



