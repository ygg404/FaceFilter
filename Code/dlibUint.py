import dlib
import numpy as np
import cv2
import os

def singleton(cls):
    instances = {}
    def wrapper(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return wrapper

@singleton
class dlibUint(object):
    def __init__(self):
        #项目路径
        self.baseDir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        #获取人脸分类器
        self.detector = dlib.get_frontal_face_detector()
        #获取人脸预测器
        self.predictor = dlib.shape_predictor(self.baseDir  + '\\Code\\shape_predictor_68_face_landmarks.dat')

if __name__  == '__main__':
    detector = dlibUint().detector
    predictor = dlibUint().predictor
    detector2 = dlibUint().detector
    predictor2 = dlibUint().predictor
    im = cv2.imread('1.jpg')
    rects = detector(im, 1)
    # np.array([[p.x, p.y] for p in predictor(img_array, rects[0]).parts()])
    # for one,num in zip(list,range(len(list))):
    #     cv2.circle(im,(one[0],one[1]),1,color=(255,0,0),2);