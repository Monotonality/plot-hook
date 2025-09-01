"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('dev/', views.dev, name='dev'),
    path('dev/base/', views.home, name='dev_base'),
    path('dev/item/', views.item, name='dev_item'),
    path('dev/category/', views.category, name='dev_category'),
    path('dev/entry/', views.entry, name='dev_entry'),
    path('item/', views.item, name='item'),
    path('category/', views.category, name='category'),
    path('entry/', views.entry, name='entry'),
]
