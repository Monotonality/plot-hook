from rest_framework import serializers
from .models import Session, SessionEntry, Quest, SessionQuestProgress

class SessionSerializer(serializers.ModelSerializer):
    """Serializer for Session model"""
    
    dm = serializers.CharField(source='dm.username', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    duration = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    players_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'title', 'description', 'campaign', 'campaign_name',
            'dm', 'players', 'scheduled_date', 'actual_start_time',
            'actual_end_time', 'status', 'status_display', 'notes',
            'created_at', 'updated_at', 'duration', 'is_completed',
            'players_count'
        ]
        read_only_fields = ['dm', 'created_at', 'updated_at']
    
    def get_players_count(self, obj):
        """Get count of players in the session"""
        return obj.players.count()

class SessionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for session lists"""
    
    dm = serializers.CharField(source='dm.username', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    players_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'title', 'campaign_name', 'dm', 'scheduled_date',
            'status', 'status_display', 'players_count', 'created_at'
        ]
    
    def get_players_count(self, obj):
        return obj.players.count()

class SessionEntrySerializer(serializers.ModelSerializer):
    """Serializer for SessionEntry model"""
    
    author = serializers.CharField(source='author.username', read_only=True)
    session_title = serializers.CharField(source='session.title', read_only=True)
    
    class Meta:
        model = SessionEntry
        fields = [
            'id', 'session', 'session_title', 'title', 'content',
            'author', 'entry_type', 'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'created_at', 'updated_at']

class QuestSerializer(serializers.ModelSerializer):
    """Serializer for Quest model"""
    
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    quest_type_display = serializers.CharField(source='get_quest_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_completed = serializers.ReadOnlyField()
    assigned_players_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'description', 'campaign', 'campaign_name',
            'quest_type', 'quest_type_display', 'status', 'status_display',
            'assigned_players', 'objectives', 'rewards', 'created_at',
            'updated_at', 'completed_at', 'is_completed', 'assigned_players_count'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_assigned_players_count(self, obj):
        """Get count of assigned players"""
        return obj.assigned_players.count()

class QuestListSerializer(serializers.ModelSerializer):
    """Simplified serializer for quest lists"""
    
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    quest_type_display = serializers.CharField(source='get_quest_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_players_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'campaign_name', 'quest_type', 'quest_type_display',
            'status', 'status_display', 'assigned_players_count', 'created_at'
        ]
    
    def get_assigned_players_count(self, obj):
        return obj.assigned_players.count()

class SessionQuestProgressSerializer(serializers.ModelSerializer):
    """Serializer for SessionQuestProgress model"""
    
    session_title = serializers.CharField(source='session.title', read_only=True)
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    
    class Meta:
        model = SessionQuestProgress
        fields = [
            'id', 'session', 'session_title', 'quest', 'quest_title',
            'objectives_completed', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']

class SessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating sessions"""
    
    class Meta:
        model = Session
        fields = [
            'title', 'description', 'campaign', 'players',
            'scheduled_date', 'notes'
        ]
    
    def create(self, validated_data):
        """Create a new session with current user as DM"""
        validated_data['dm'] = self.context['request'].user
        return super().create(validated_data)

class QuestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating quests"""
    
    class Meta:
        model = Quest
        fields = [
            'title', 'description', 'campaign', 'quest_type',
            'assigned_players', 'objectives', 'rewards'
        ]
