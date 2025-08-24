from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
    
    # Profile management
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('password/change/', views.password_change, name='password_change'),
    path('delete/', views.delete_account, name='delete_account'),
    
    # Public profiles
    path('profile/<str:username>/', views.public_profile, name='public_profile'),
    
    # AJAX endpoints
    path('toggle-theme/', views.toggle_theme, name='toggle_theme'),
    
    # Redirects
    path('dashboard/', views.dashboard_redirect, name='dashboard_redirect'),
]
