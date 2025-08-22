from rest_framework import serializers
from .models import Category, Entry, HiddenTextBlock, CrossReference

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    full_path = serializers.ReadOnlyField()
    children_count = serializers.SerializerMethodField()
    entries_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'title', 'description', 'book_type', 'parent', 
            'owner', 'is_hidden', 'created_at', 'updated_at',
            'full_path', 'children_count', 'entries_count'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']
    
    def get_children_count(self, obj):
        """Get count of child categories"""
        return obj.children.count()
    
    def get_entries_count(self, obj):
        """Get count of entries in this category"""
        return obj.entries.count()

class CategoryListSerializer(serializers.ModelSerializer):
    """Simplified serializer for category lists"""
    
    full_path = serializers.ReadOnlyField()
    children_count = serializers.SerializerMethodField()
    entries_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'title', 'description', 'book_type', 'parent',
            'is_hidden', 'full_path', 'children_count', 'entries_count'
        ]
    
    def get_children_count(self, obj):
        return obj.children.count()
    
    def get_entries_count(self, obj):
        return obj.entries.count()

class HiddenTextBlockSerializer(serializers.ModelSerializer):
    """Serializer for HiddenTextBlock model"""
    
    class Meta:
        model = HiddenTextBlock
        fields = [
            'id', 'entry', 'content', 'start_position', 'end_position',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class EntrySerializer(serializers.ModelSerializer):
    """Serializer for Entry model"""
    
    full_path = serializers.ReadOnlyField()
    category_title = serializers.CharField(source='category.title', read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    hidden_blocks = HiddenTextBlockSerializer(many=True, read_only=True)
    outgoing_references_count = serializers.SerializerMethodField()
    incoming_references_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Entry
        fields = [
            'id', 'title', 'content', 'category', 'category_title',
            'book_type', 'owner', 'owner_username', 'is_hidden',
            'created_at', 'updated_at', 'full_path', 'hidden_blocks',
            'outgoing_references_count', 'incoming_references_count'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']
    
    def get_outgoing_references_count(self, obj):
        """Get count of outgoing cross-references"""
        return obj.outgoing_references.count()
    
    def get_incoming_references_count(self, obj):
        """Get count of incoming cross-references"""
        return obj.incoming_references.count()

class EntryListSerializer(serializers.ModelSerializer):
    """Simplified serializer for entry lists"""
    
    category_title = serializers.CharField(source='category.title', read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    content_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Entry
        fields = [
            'id', 'title', 'content_preview', 'category', 'category_title',
            'book_type', 'owner_username', 'is_hidden', 'created_at', 'updated_at'
        ]
    
    def get_content_preview(self, obj):
        """Get a preview of the content (first 150 characters)"""
        return obj.content[:150] + '...' if len(obj.content) > 150 else obj.content

class CrossReferenceSerializer(serializers.ModelSerializer):
    """Serializer for CrossReference model"""
    
    source_entry_title = serializers.CharField(source='source_entry.title', read_only=True)
    target_entry_title = serializers.CharField(source='target_entry.title', read_only=True)
    source_entry_book_type = serializers.CharField(source='source_entry.book_type', read_only=True)
    target_entry_book_type = serializers.CharField(source='target_entry.book_type', read_only=True)
    
    class Meta:
        model = CrossReference
        fields = [
            'id', 'source_entry', 'source_entry_title', 'source_entry_book_type',
            'target_entry', 'target_entry_title', 'target_entry_book_type',
            'description', 'created_at'
        ]
        read_only_fields = ['created_at']

class CrossReferenceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating cross-references"""
    
    class Meta:
        model = CrossReference
        fields = ['source_entry', 'target_entry', 'description']
    
    def validate(self, data):
        """Validate that source and target entries are different"""
        if data['source_entry'] == data['target_entry']:
            raise serializers.ValidationError("Source and target entries must be different")
        return data
