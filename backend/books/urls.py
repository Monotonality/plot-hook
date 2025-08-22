from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, EntryViewSet, HiddenTextBlockViewSet, CrossReferenceViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'entries', EntryViewSet)
router.register(r'hidden-blocks', HiddenTextBlockViewSet)
router.register(r'cross-references', CrossReferenceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
