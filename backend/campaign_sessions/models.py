from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Session(models.Model):
    """
    Session model for tracking individual campaign sessions.
    """
    
    SESSION_STATUS = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    campaign = models.ForeignKey('users.Campaign', on_delete=models.CASCADE, related_name='sessions')
    dm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dm_sessions')
    players = models.ManyToManyField(User, related_name='player_sessions', blank=True)
    scheduled_date = models.DateTimeField()
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=SESSION_STATUS, default='planned')
    notes = models.TextField(blank=True, help_text="DM notes for the session")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_date']
    
    def __str__(self):
        return f"{self.campaign.name}: {self.title}"
    
    @property
    def duration(self):
        """Calculate session duration if completed"""
        if self.actual_start_time and self.actual_end_time:
            return self.actual_end_time - self.actual_start_time
        return None
    
    @property
    def is_completed(self):
        """Check if session is completed"""
        return self.status == 'completed'

class SessionEntry(models.Model):
    """
    Entries specifically for session notes and documentation.
    Links to the Story Book system.
    """
    
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session_entries')
    entry_type = models.CharField(max_length=50, default='general', help_text="Type of entry (combat, roleplay, etc.)")
    is_public = models.BooleanField(default=True, help_text="Whether players can see this entry")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Session Entries"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.session.title}: {self.title}"

class Quest(models.Model):
    """
    Quest model for tracking campaign quests and objectives.
    """
    
    QUEST_STATUS = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('abandoned', 'Abandoned'),
    ]
    
    QUEST_TYPES = [
        ('main', 'Main Quest'),
        ('side', 'Side Quest'),
        ('personal', 'Personal Quest'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    campaign = models.ForeignKey('users.Campaign', on_delete=models.CASCADE, related_name='quests')
    quest_type = models.CharField(max_length=20, choices=QUEST_TYPES, default='side')
    status = models.CharField(max_length=20, choices=QUEST_STATUS, default='active')
    assigned_players = models.ManyToManyField(User, related_name='assigned_quests', blank=True)
    objectives = models.JSONField(default=list, help_text="List of quest objectives")
    rewards = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.campaign.name}: {self.title}"
    
    @property
    def is_completed(self):
        """Check if quest is completed"""
        return self.status == 'completed'

class SessionQuestProgress(models.Model):
    """
    Track quest progress during specific sessions.
    """
    
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='quest_progress')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='session_progress')
    objectives_completed = models.JSONField(default=list, help_text="List of completed objective IDs")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session', 'quest']
    
    def __str__(self):
        return f"{self.session.title} - {self.quest.title} Progress"
