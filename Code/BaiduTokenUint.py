import numpy as np
import json
import os
import requests

def singleton(cls):
    instances = {}
    def wrapper(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return wrapper

@singleton
class BaiduPicIndentify(object):
    def __init__(self):
        self.AK = "YHqa6VW5Y4VG1AIWwwLiGxnz"
        self.SK = "Cqjw5Yjiiuxdm2xyDVDbRpBLIUxozWQC"
        self.headers = {
            "Content-Type": "application/json; charset=UTF-8"
        }
        self.access_token = ''

    def get_accessToken(self):
        host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + self.AK + '&client_secret=' + self.SK
        response = requests.get(host, headers=self.headers)
        json_result = json.loads(response.text)
        self.access_token = json_result['access_token']