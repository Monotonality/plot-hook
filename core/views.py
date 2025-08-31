from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db import models
from .models import World, WorldUser, Category


# Create your views here.

@login_required
def dashboard(request):
    """Dashboard page view that displays the campaign/world cards"""
    # Get worlds where user is owner or member
    owned_worlds = World.objects.filter(owner=request.user)
    member_worlds = World.objects.filter(world_users__user=request.user).exclude(owner=request.user)
    
    context = {
        'user': request.user,
        'owned_worlds': owned_worlds,
        'member_worlds': member_worlds,
    }
    return render(request, 'dashboard.html', context)

@login_required
def search(request):
    """API endpoint for search functionality"""
    if request.method == 'GET':
        search_term = request.GET.get('q', '')
        # For now, return empty results - this can be expanded later
        # to search through actual database content
        return JsonResponse({
            'results': [],
            'search_term': search_term
        })
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def landing(request):
    """Landing page for all users"""
    context = {
        'user': request.user,
    }
    return render(request, 'landing.html', context)


@login_required
def world_list(request):
    """List all worlds the user has access to"""
    # Get worlds where user is owner or member
    owned_worlds = World.objects.filter(owner=request.user)
    member_worlds = World.objects.filter(world_users__user=request.user).exclude(owner=request.user)
    
    context = {
        'owned_worlds': owned_worlds,
        'member_worlds': member_worlds,
    }
    return render(request, 'dashboard.html', context)


@login_required
def world_detail(request, world_id):
    """Show world details and categories"""
    print(f"DEBUG: world_detail view called with world_id={world_id}")  # Debug line
    world = get_object_or_404(World, id=world_id)
    
    # Check if user has access to this world
    if not world.world_users.filter(user=request.user).exists() and world.owner != request.user:
        messages.error(request, "You don't have access to this world.")
        return redirect('world_list')
    
    # Get root categories (no parent)
    root_categories = world.categories.filter(parent=None, is_hidden=False)
    
    context = {
        'world': world,
        'root_categories': root_categories,
    }
    return render(request, 'category.html', context)


@login_required
def category_detail(request, world_id, category_id):
    """Show category details and its contents"""
    world = get_object_or_404(World, id=world_id)
    category = get_object_or_404(Category, id=category_id, world=world)
    
    # Check if user has access to this world
    if not world.world_users.filter(user=request.user).exists() and world.owner != request.user:
        messages.error(request, "You don't have access to this world.")
        return redirect('world_list')
    
    # Check if category is hidden and user is not author
    if category.is_hidden and not world.world_users.filter(user=request.user, role__in=['creator', 'co_creator']).exists():
        messages.error(request, "This category is hidden from you.")
        return redirect('world_detail', world_id=world_id)
    
    # Get subcategories and entries (we'll add entries later)
    subcategories = category.subcategories.filter(is_hidden=False)
    
    context = {
        'world': world,
        'category': category,
        'subcategories': subcategories,
        'ancestors': category.get_ancestors(),
    }
    return render(request, 'category.html', context)


# API views for AJAX requests
@login_required
def api_worlds(request):
    """API endpoint to get user's worlds"""
    worlds = World.objects.filter(
        models.Q(owner=request.user) | 
        models.Q(world_users__user=request.user)
    ).distinct()
    
    data = [{
        'id': world.id,
        'name': world.name,
        'description': world.description,
        'is_owner': world.owner == request.user,
        'join_code': world.join_code,
    } for world in worlds]
    
    return JsonResponse({'worlds': data})


@login_required
def join_world(request):
    """API endpoint to join a world using join code"""
    if request.method == 'POST':
        join_code = request.POST.get('join_code', '').strip().upper()
        
        if not join_code:
            return JsonResponse({
                'success': False,
                'error': 'Please enter a join code.'
            }, status=400)
        
        try:
            # Find world by join code
            world = World.objects.get(join_code=join_code, is_active=True)
            
            # Check if user is already a member
            if world.owner == request.user:
                return JsonResponse({
                    'success': False,
                    'error': 'You are already the owner of this world.'
                }, status=400)
            
            if world.world_users.filter(user=request.user).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'You are already a member of this world.'
                }, status=400)
            
            # Add user to world as a player
            WorldUser.objects.create(
                world=world,
                user=request.user,
                role='player'
            )
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully joined "{world.name}"!',
                'world': {
                    'id': world.id,
                    'name': world.name,
                    'join_code': world.join_code,
                }
            })
            
        except World.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Invalid join code. Please check and try again.'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'An error occurred while joining the world.'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def delete_world(request, world_id):
    """API endpoint to delete a world (owner only)"""
    if request.method == 'POST':
        try:
            world = World.objects.get(id=world_id, owner=request.user)
            
            # Delete the world (this will cascade to related objects)
            world.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'World "{world.name}" has been deleted.'
            })
            
        except World.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'World not found or you do not have permission to delete it.'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'An error occurred while deleting the world.'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def leave_world(request, world_id):
    """API endpoint to leave a world (player only)"""
    if request.method == 'POST':
        try:
            world = World.objects.get(id=world_id)
            
            # Check if user is the owner
            if world.owner == request.user:
                return JsonResponse({
                    'success': False,
                    'error': 'World owners cannot leave their own world. Use delete instead.'
                }, status=400)
            
            # Check if user is a member
            try:
                world_user = WorldUser.objects.get(world=world, user=request.user)
                world_user.delete()
                
                return JsonResponse({
                    'success': True,
                    'message': f'You have left "{world.name}".'
                })
                
            except WorldUser.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'You are not a member of this world.'
                }, status=400)
                
        except World.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'World not found.'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'An error occurred while leaving the world.'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def create_world(request):
    """API endpoint to create a new world"""
    if request.method == 'POST':
        world_name = request.POST.get('world_name', '').strip()
        theme_color = request.POST.get('theme_color', '').strip()
        
        if not world_name:
            return JsonResponse({
                'success': False,
                'error': 'Please enter a world name.'
            }, status=400)
        
        if not theme_color:
            return JsonResponse({
                'success': False,
                'error': 'Please select a theme color.'
            }, status=400)
        
        try:
            # Generate a unique join code
            import random
            import string
            
            def generate_join_code():
                return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            join_code = generate_join_code()
            while World.objects.filter(join_code=join_code).exists():
                join_code = generate_join_code()
            
            # Create the world
            world = World.objects.create(
                name=world_name,
                owner=request.user,
                join_code=join_code,
                theme_color=theme_color,
                is_active=True
            )
            
            return JsonResponse({
                'success': True,
                'message': f'World "{world_name}" has been created successfully!',
                'world': {
                    'id': world.id,
                    'name': world.name,
                    'join_code': world.join_code,
                    'theme_color': theme_color,
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'An error occurred while creating the world.'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def dev_page(request):
    """Development page for testing and navigation"""
    context = {
        'user': request.user,
    }
    return render(request, 'dev.html', context)


def category_template(request):
    """Direct template view for category.html"""
    context = {
        'user': request.user,
    }
    return render(request, 'category.html', context)


def world_categories(request, world_id):
    """Show world categories page"""
    print(f"DEBUG: world_categories view called with world_id={world_id}")  # Debug line
    world = get_object_or_404(World, id=world_id)
    
    # Check if user has access to this world
    if not world.world_users.filter(user=request.user).exists() and world.owner != request.user:
        messages.error(request, "You don't have access to this world.")
        return redirect('core:dashboard')
    
    # Get root categories (no parent)
    root_categories = world.categories.filter(parent=None, is_hidden=False)
    
    context = {
        'world': world,
        'categories': root_categories,
    }
    return render(request, 'category.html', context)
