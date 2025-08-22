from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SessionViewSet, SessionEntryViewSet, QuestViewSet, SessionQuestProgressViewSet
)

router = DefaultRouter()
router.register(r'sessions', SessionViewSet)
router.register(r'session-entries', SessionEntryViewSet)
router.register(r'quests', QuestViewSet)
router.register(r'quest-progress', SessionQuestProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
