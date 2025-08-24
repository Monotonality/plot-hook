from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def home(request):
    """Home page view that displays the campaign/world cards"""
    return render(request, 'home.html')

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
    """Landing page for non-authenticated users"""
    return render(request, 'landing.html')
