from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # Existing URLs
    path('', views.landing, name='landing'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('search/', views.search, name='search'),
    
    # World Book URLs
    path('worlds/', views.world_list, name='world_list'),
    path('worlds/<int:world_id>/', views.world_detail, name='world_detail'),
    path('worlds/<int:world_id>/categories/<int:category_id>/', views.category_detail, name='category_detail'),
    
    # API URLs
    path('api/worlds/', views.api_worlds, name='api_worlds'),
    path('api/join-world/', views.join_world, name='join_world'),
    path('api/create-world/', views.create_world, name='create_world'),
    path('api/worlds/<int:world_id>/delete/', views.delete_world, name='delete_world'),
    path('api/worlds/<int:world_id>/leave/', views.leave_world, name='leave_world'),
]
