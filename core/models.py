from django.db import models
from django.conf import settings
import uuid


class World(models.Model):
    """A D&D world/campaign container"""
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, help_text="Name of the world/campaign")
    description = models.TextField(blank=True, help_text="Brief description of the world/universe")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_worlds',
        help_text="World creator/DM"
    )
    join_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        help_text="Unique code for sharing world access"
    )
    theme_color = models.CharField(
        max_length=20,
        default='#8b7355',
        help_text="Theme color for the world card"
    )
    is_active = models.BooleanField(default=True, help_text="Whether world is currently active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'World'
        verbose_name_plural = 'Worlds'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.join_code:
            self.join_code = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)


class WorldUser(models.Model):
    """User access and role management for worlds"""
    
    ROLE_CHOICES = [
        ('creator', 'Creator'),
        ('co_creator', 'Co-Creator'),
        ('player', 'Player'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    world = models.ForeignKey(World, on_delete=models.CASCADE, related_name='world_users')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='world_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, help_text="User role in this world")
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'World User'
        verbose_name_plural = 'World Users'
        unique_together = ['world', 'user']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.world.name} ({self.role})"


class Category(models.Model):
    """Hierarchical organization for World Book content"""
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, help_text="Category name")
    description = models.TextField(blank=True, help_text="Brief description of the category")
    world = models.ForeignKey(World, on_delete=models.CASCADE, related_name='categories', help_text="World this category belongs to")
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories',
        help_text="Parent category for hierarchy"
    )
    sort_order = models.IntegerField(default=0, help_text="Order within parent category")
    is_hidden = models.BooleanField(default=False, help_text="Hide category from non-authors")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        unique_together = ['world', 'parent', 'name']
        ordering = ['sort_order', 'name']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name
    
    def get_ancestors(self):
        """Get all ancestor categories"""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return list(reversed(ancestors))
    
    def get_descendants(self):
        """Get all descendant categories"""
        descendants = []
        for subcategory in self.subcategories.all():
            descendants.append(subcategory)
            descendants.extend(subcategory.get_descendants())
        return descendants
