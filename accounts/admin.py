from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined', 'last_login')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'date_joined', 'last_login', 'theme_preference')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'bio', 'avatar', 'date_of_birth', 'location', 'website')}),
        ('Preferences', {'fields': ('theme_preference',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'favorite_dnd_edition', 'dm_experience_years', 'player_experience_years', 'profile_public', 'show_email')
    list_filter = ('favorite_dnd_edition', 'profile_public', 'show_email', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name', 'discord_username', 'twitter_handle')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('D&D Information', {
            'fields': ('favorite_dnd_edition', 'dm_experience_years', 'player_experience_years'),
        }),
        ('Social Media', {
            'fields': ('discord_username', 'twitter_handle'),
        }),
        ('Privacy Settings', {
            'fields': ('profile_public', 'show_email'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


# Register the custom User model
admin.site.register(User, UserAdmin)
