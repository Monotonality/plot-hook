from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def dashboard(request):
    """Dashboard page view that displays the campaign/world cards"""
    context = {
        'user': request.user,
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
