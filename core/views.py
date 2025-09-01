from django.shortcuts import render

def home(request):
    return render(request, 'base.html')

def dev(request):
    return render(request, 'dev.html')

def item(request):
    return render(request, 'item.html')

def category(request):
    return render(request, 'category.html')

def entry(request):
    return render(request, 'entry.html')

def test_card(request):
    return render(request, 'test_card.html')
