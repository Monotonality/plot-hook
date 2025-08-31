from django.shortcuts import render

def home(request):
    return render(request, 'base.html')

def dev(request):
    return render(request, 'dev.html')

def item(request):
    return render(request, 'item.html')

def category(request):
    return render(request, 'category.html')
