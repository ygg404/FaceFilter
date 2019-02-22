from django.conf.urls import url,include

from django.conf.urls import url,include
from Beauty import views

urlpatterns = [
    url(r'^$', views.Index,name='Beauty'),
    url(r'^beautydetect$',views.beautydetect, name='beautydetect'),
]
