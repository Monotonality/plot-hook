from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Category(models.Model):
    """
    Category model for organizing content across all three books.
    Categories can contain sub-categories and entries.
    """
    
    BOOK_TYPES = [
        ('world', 'World Book'),
        ('adventurer', 'Adventurer\'s Book'),
        ('story', 'Story Book'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    book_type = models.CharField(max_length=20, choices=BOOK_TYPES)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_categories')
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['title']
    
    def __str__(self):
        return f"{self.get_book_type_display()}: {self.title}"
    
    @property
    def full_path(self):
        """Get the full hierarchical path of this category"""
        path = [self.title]
        current = self.parent
        while current:
            path.insert(0, current.title)
            current = current.parent
        return " > ".join(path)

class Entry(models.Model):
    """
    Entry model for detailed content pages across all three books.
    Entries can contain text, images, and links to other content.
    """
    
    BOOK_TYPES = [
        ('world', 'World Book'),
        ('adventurer', 'Adventurer\'s Book'),
        ('story', 'Story Book'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='entries')
    book_type = models.CharField(max_length=20, choices=BOOK_TYPES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_entries')
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Entries"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.get_book_type_display()}: {self.title}"
    
    @property
    def full_path(self):
        """Get the full path including category"""
        return f"{self.category.full_path} > {self.title}"

class HiddenTextBlock(models.Model):
    """
    Model for hidden text blocks within public entries.
    Allows DMs to have private notes within public content.
    """
    
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='hidden_blocks')
    content = models.TextField()
    start_position = models.IntegerField(help_text="Character position where hidden content starts")
    end_position = models.IntegerField(help_text="Character position where hidden content ends")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_position']
    
    def __str__(self):
        return f"Hidden block in {self.entry.title}"

class CrossReference(models.Model):
    """
    Model for cross-references between entries.
    Allows players to link their notes to official World Book entries.
    """
    
    source_entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='outgoing_references')
    target_entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='incoming_references')
    description = models.CharField(max_length=500, blank=True, help_text="Description of the reference")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['source_entry', 'target_entry']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.source_entry.title} → {self.target_entry.title}"
