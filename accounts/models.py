from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom user model for Plot Hook"""
    
    # Additional fields
    bio = models.TextField(max_length=500, blank=True, help_text="Tell us about yourself")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, help_text="Profile picture")
    date_of_birth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    
    # User preferences
    theme_preference = models.CharField(
        max_length=20,
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto'),
        ],
        default='dark'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.username
    
    def get_full_name(self):
        """Return the user's full name"""
        return self.username
    
    def get_short_name(self):
        """Return the user's short name"""
        return self.username


class UserProfile(models.Model):
    """Extended user profile information"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # D&D specific fields
    favorite_dnd_edition = models.CharField(
        max_length=20,
        choices=[
            ('1e', '1st Edition'),
            ('2e', '2nd Edition'),
            ('3e', '3rd Edition'),
            ('3.5e', '3.5 Edition'),
            ('4e', '4th Edition'),
            ('5e', '5th Edition'),
            ('other', 'Other'),
        ],
        blank=True
    )
    
    dm_experience_years = models.PositiveIntegerField(default=0, help_text="Years of DM experience")
    player_experience_years = models.PositiveIntegerField(default=0, help_text="Years of player experience")
    
    # Social fields
    discord_username = models.CharField(max_length=100, blank=True)
    twitter_handle = models.CharField(max_length=100, blank=True)
    
    # Privacy settings
    profile_public = models.BooleanField(default=True, help_text="Make profile visible to other users")
    show_email = models.BooleanField(default=False, help_text="Show email to other users")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
