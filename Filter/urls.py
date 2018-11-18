from django.conf.urls import url,include

from django.conf.urls import url,include
from Filter import views

urlpatterns = [
    url(r'^$', views.Index,name='Filter'),
    url(r'^facedetect$',views.facedetect, name='facedetect'),
]