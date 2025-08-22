from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    """
    Custom User model with role management for DMs and players.
    """
    
    USER_ROLES = [
        ('dm', 'Dungeon Master'),
        ('player', 'Player'),
    ]
    
    role = models.CharField(max_length=10, choices=USER_ROLES, default='player')
    bio = models.TextField(blank=True, help_text="Brief description about the user")
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_dm(self):
        """Check if user is a Dungeon Master"""
        return self.role == 'dm'
    
    @property
    def is_player(self):
        """Check if user is a Player"""
        return self.role == 'player'
    
    def can_edit_world_book(self):
        """Check if user can edit World Book content"""
        return self.is_dm
    
    def can_view_hidden_content(self):
        """Check if user can view hidden content"""
        return self.is_dm
    
    def can_edit_entry(self, entry):
        """Check if user can edit a specific entry"""
        if self.is_dm:
            return True
        return entry.owner == self and entry.book_type == 'adventurer'

class UserProfile(models.Model):
    """
    Extended profile information for users.
    """
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    favorite_genre = models.CharField(max_length=100, blank=True)
    experience_level = models.CharField(max_length=50, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    notification_preferences = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Profile for {self.user.username}"

class Campaign(models.Model):
    """
    Campaign model to group users and content together.
    """
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    dm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dm_campaigns')
    players = models.ManyToManyField(User, related_name='player_campaigns', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def all_participants(self):
        """Get all participants including DM and players"""
        participants = [self.dm]
        participants.extend(self.players.all())
        return participants
