from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # Existing URLs
    path('', views.landing, name='landing'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('search/', views.search, name='search'),
    
    # Development URLs
    path('dev/', views.dev_page, name='dev_page'),
    path('category/', views.category_template, name='category_template'),
    
    # API URLs
    path('api/worlds/', views.api_worlds, name='api_worlds'),
    path('api/join-world/', views.join_world, name='join_world'),
    path('api/create-world/', views.create_world, name='create_world'),
    path('api/worlds/<int:world_id>/delete/', views.delete_world, name='delete_world'),
    path('api/worlds/<int:world_id>/leave/', views.leave_world, name='leave_world'),
    path('api/worlds/<slug:world_slug>/categories/create/', views.create_category, name='create_category'),
    
    # World Book URLs (more specific patterns first)
    path('worlds/', views.world_list, name='world_list'),
    path('w/<slug:world_slug>/<slug:category_slug>/', views.category_detail, name='category_detail'),
    path('w/<slug:world_slug>/', views.world_categories, name='world_categories'),
]
