from django.contrib import admin
from .models import World, WorldUser, Category


@admin.register(World)
class WorldAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_active', 'created_at', 'join_code']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['join_code', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'owner')
        }),
        ('Access Control', {
            'fields': ('join_code', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(WorldUser)
class WorldUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'world', 'role', 'joined_at']
    list_filter = ['role', 'joined_at', 'world']
    search_fields = ['user__username', 'world__name']
    readonly_fields = ['joined_at']
    
    fieldsets = (
        ('Membership', {
            'fields': ('user', 'world', 'role')
        }),
        ('Timestamps', {
            'fields': ('joined_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'world', 'parent', 'is_hidden', 'sort_order']
    list_filter = ['is_hidden', 'created_at', 'world']
    search_fields = ['name', 'description', 'world__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'world')
        }),
        ('Organization', {
            'fields': ('parent', 'sort_order')
        }),
        ('Visibility', {
            'fields': ('is_hidden',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('world', 'parent')
