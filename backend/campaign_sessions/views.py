from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Session, SessionEntry, Quest, SessionQuestProgress
from .serializers import (
    SessionSerializer, SessionListSerializer, SessionEntrySerializer,
    QuestSerializer, QuestListSerializer, SessionQuestProgressSerializer,
    SessionCreateSerializer, QuestCreateSerializer
)
from django.utils import timezone

class SessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Session model.
    Provides session management functionality.
    """
    
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campaign', 'dm', 'status', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['scheduled_date', 'created_at']
    ordering = ['-scheduled_date']
    
    def get_queryset(self):
        """Filter sessions based on user participation"""
        user = self.request.user
        return Session.objects.filter(
            Q(dm=user) | Q(players=user)
        ).distinct()
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return SessionListSerializer
        elif self.action == 'create':
            return SessionCreateSerializer
        return SessionSerializer
    
    def perform_create(self, serializer):
        """Set the DM to the current user"""
        serializer.save(dm=self.request.user)
    
    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        """Start a session"""
        session = self.get_object()
        
        # Only the DM can start the session
        if session.dm != request.user:
            return Response(
                {"error": "Only the DM can start the session"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if session.status != 'planned':
            return Response(
                {"error": "Session can only be started if it's planned"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'in_progress'
        session.actual_start_time = timezone.now()
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """End a session"""
        session = self.get_object()
        
        # Only the DM can end the session
        if session.dm != request.user:
            return Response(
                {"error": "Only the DM can end the session"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if session.status != 'in_progress':
            return Response(
                {"error": "Session can only be ended if it's in progress"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'completed'
        session.actual_end_time = timezone.now()
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """Get entries for a specific session"""
        session = self.get_object()
        entries = session.entries.all()
        serializer = SessionEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def quest_progress(self, request, pk=None):
        """Get quest progress for a specific session"""
        session = self.get_object()
        progress = session.quest_progress.all()
        serializer = SessionQuestProgressSerializer(progress, many=True)
        return Response(serializer.data)

class SessionEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SessionEntry model.
    """
    
    queryset = SessionEntry.objects.all()
    serializer_class = SessionEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['session', 'author', 'entry_type', 'is_public']
    search_fields = ['title', 'content']
    
    def get_queryset(self):
        """Filter entries based on user permissions"""
        user = self.request.user
        
        # DMs can see all entries
        if user.is_dm:
            return SessionEntry.objects.all()
        
        # Players can only see public entries and their own entries
        return SessionEntry.objects.filter(
            Q(is_public=True) | Q(author=user)
        )
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)

class QuestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Quest model.
    Provides quest management functionality.
    """
    
    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campaign', 'quest_type', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter quests based on user participation"""
        user = self.request.user
        return Quest.objects.filter(
            Q(campaign__dm=user) | Q(campaign__players=user)
        ).distinct()
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return QuestListSerializer
        elif self.action == 'create':
            return QuestCreateSerializer
        return QuestSerializer
    
    @action(detail=True, methods=['post'])
    def complete_quest(self, request, pk=None):
        """Mark a quest as completed"""
        quest = self.get_object()
        
        # Only the DM can complete quests
        if quest.campaign.dm != request.user:
            return Response(
                {"error": "Only the DM can complete quests"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if quest.status != 'active':
            return Response(
                {"error": "Only active quests can be completed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        quest.status = 'completed'
        quest.completed_at = timezone.now()
        quest.save()
        
        serializer = self.get_serializer(quest)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def session_progress(self, request, pk=None):
        """Get session progress for a specific quest"""
        quest = self.get_object()
        progress = quest.session_progress.all()
        serializer = SessionQuestProgressSerializer(progress, many=True)
        return Response(serializer.data)

class SessionQuestProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SessionQuestProgress model.
    """
    
    queryset = SessionQuestProgress.objects.all()
    serializer_class = SessionQuestProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['session', 'quest']
    
    def get_queryset(self):
        """Filter progress based on user participation"""
        user = self.request.user
        return SessionQuestProgress.objects.filter(
            Q(session__dm=user) | Q(session__players=user)
        ).distinct()
