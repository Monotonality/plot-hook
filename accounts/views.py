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
    profile = user.profile
    
    if request.method == 'POST':
        user_form = UserProfileForm(request.POST, request.FILES, instance=user)
        profile_form = ExtendedProfileForm(request.POST, instance=profile)
        
        if user_form.is_valid() and profile_form.is_valid():
            with transaction.atomic():
                user_form.save()
                profile_form.save()
            
            messages.success(request, 'Profile updated successfully!')
            return redirect('accounts:profile')
    else:
        user_form = UserProfileForm(instance=user)
        profile_form = ExtendedProfileForm(instance=profile)
    
    context = {
        'user_form': user_form,
        'profile_form': profile_form,
    }
    return render(request, 'accounts/profile_edit.html', context)


@login_required
def password_change(request):
    """Change user password"""
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Password changed successfully!')
            return redirect('accounts:profile')
    else:
        form = PasswordChangeForm(request.user)
    
    context = {
        'form': form,
    }
    return render(request, 'accounts/password_change.html', context)


@login_required
def delete_account(request):
    """Delete user account"""
    if request.method == 'POST':
        user = request.user
        logout(request)
        user.delete()
        messages.success(request, 'Your account has been deleted.')
        return redirect('core:landing')
    
    return render(request, 'accounts/delete_account.html')


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
