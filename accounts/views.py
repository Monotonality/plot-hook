from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from .forms import (
    CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm,
    ExtendedProfileForm, PasswordChangeForm
)
from .models import User, UserProfile


class SignUpView(CreateView):
    """User registration view"""
    form_class = CustomUserCreationForm
    template_name = 'accounts/signup.html'
    success_url = reverse_lazy('accounts:login')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        
        # Create user profile
        UserProfile.objects.create(user=self.object)
        
        messages.success(
            self.request,
            'Account created successfully! Please log in to continue.'
        )
        return response


class CustomLoginView(LoginView):
    """Custom login view"""
    form_class = CustomAuthenticationForm
    template_name = 'accounts/login.html'
    
    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')
        if not remember_me:
            # Set session to expire when browser closes
            self.request.session.set_expiry(0)
        
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse_lazy('core:dashboard')


class CustomLogoutView(LogoutView):
    """Custom logout view"""
    next_page = reverse_lazy('core:landing')
    
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        messages.success(request, 'You have been successfully logged out.')
        return response


@login_required
def profile_view(request):
    """User profile view"""
    user = request.user
    profile = user.profile
    
    context = {
        'user': user,
        'profile': profile,
    }
    return render(request, 'accounts/profile.html', context)


@login_required
def profile_edit(request):
    """Edit user profile"""
    user = request.user
    
    if request.method == 'POST':
        # Handle simple form from profile settings page
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        
        # Basic validation
        if username and email:
            # Check if username is already taken by another user
            if User.objects.filter(username=username).exclude(id=user.id).exists():
                messages.error(request, 'Username is already taken.')
                return redirect('accounts:profile_settings')
            
            # Check if email is already taken by another user
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                messages.error(request, 'Email is already taken.')
                return redirect('accounts:profile_settings')
            
            # Update user information
            user.username = username
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            
            messages.success(request, 'Profile updated successfully!')
            return redirect('accounts:profile_settings')
        else:
            messages.error(request, 'Username and email are required.')
            return redirect('accounts:profile_settings')
    
    # If GET request, redirect to profile settings page
    return redirect('accounts:profile_settings')


@login_required
def password_change(request):
    """Change user password"""
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Password changed successfully!')
            return redirect('accounts:profile_settings')
        else:
            # If form is invalid, redirect back with error message
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
            return redirect('accounts:profile_settings')
    
    # If GET request, redirect to profile settings page
    return redirect('accounts:profile_settings')


@login_required
def delete_account(request):
    """Delete user account"""
    if request.method == 'POST':
        confirm_delete = request.POST.get('confirm_delete')
        
        if confirm_delete == 'DELETE':
            user = request.user
            logout(request)
            user.delete()
            messages.success(request, 'Your account has been deleted.')
            return redirect('core:landing')
        else:
            messages.error(request, 'Please type "DELETE" to confirm account deletion.')
            return redirect('accounts:profile_settings')
    
    # If GET request, redirect to profile settings page
    return redirect('accounts:profile_settings')


def public_profile(request, username):
    """Public profile view for other users"""
    user = get_object_or_404(User, username=username)
    profile = user.profile
    
    # Check if profile is public
    if not profile.profile_public:
        messages.error(request, 'This profile is private.')
        return redirect('core:landing')
    
    context = {
        'profile_user': user,
        'profile': profile,
    }
    return render(request, 'accounts/public_profile.html', context)


@login_required
@require_POST
@csrf_exempt
def toggle_theme(request):
    """Toggle user theme preference"""
    user = request.user
    current_theme = user.theme_preference
    
    if current_theme == 'dark':
        user.theme_preference = 'light'
    else:
        user.theme_preference = 'dark'
    
    user.save()
    
    return JsonResponse({
        'success': True,
        'theme': user.theme_preference
    })


@login_required
def dashboard_redirect(request):
    """Redirect to dashboard after login"""
    return redirect('core:dashboard')


@login_required
def profile_settings(request):
    """Profile settings page"""
    context = {
        'user': request.user,
    }
    return render(request, 'accounts/profile_settings.html', context)
