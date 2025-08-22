from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Entry, HiddenTextBlock, CrossReference
from .serializers import (
    CategorySerializer, CategoryListSerializer,
    EntrySerializer, EntryListSerializer,
    HiddenTextBlockSerializer,
    CrossReferenceSerializer, CrossReferenceCreateSerializer
)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return obj.owner == request.user

class IsDMOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission for DM-only content.
    Only DMs can edit World Book content, players can only edit their own Adventurer's Book content.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # DMs can edit anything
        if request.user.is_dm:
            return True
        
        # Players can only edit their own Adventurer's Book content
        return obj.owner == request.user and obj.book_type == 'adventurer'

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Category model.
    Provides CRUD operations for categories across all three books.
    """
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsDMOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['book_type', 'parent', 'is_hidden', 'owner']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['title']
    
    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = super().get_queryset()
        user = self.request.user
        
        # DMs can see everything
        if user.is_dm:
            return queryset
        
        # Players can only see non-hidden content and their own content
        return queryset.filter(
            Q(is_hidden=False) | Q(owner=user)
        )
    
    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer
    
    def perform_create(self, serializer):
        """Set the owner to the current user"""
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'])
    def children(self, request, pk=None):
        """Get child categories of a specific category"""
        category = self.get_object()
        children = category.children.all()
        serializer = self.get_serializer(children, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """Get entries in a specific category"""
        category = self.get_object()
        entries = category.entries.all()
        serializer = EntryListSerializer(entries, many=True, context={'request': request})
        return Response(serializer.data)

class EntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Entry model.
    Provides CRUD operations for entries across all three books.
    """
    
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsDMOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['book_type', 'category', 'is_hidden', 'owner']
    search_fields = ['title', 'content']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        """Filter queryset based on user permissions"""
        queryset = super().get_queryset()
        user = self.request.user
        
        # DMs can see everything
        if user.is_dm:
            return queryset
        
        # Players can only see non-hidden content and their own content
        return queryset.filter(
            Q(is_hidden=False) | Q(owner=user)
        )
    
    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'list':
            return EntryListSerializer
        return EntrySerializer
    
    def perform_create(self, serializer):
        """Set the owner to the current user"""
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'])
    def hidden_blocks(self, request, pk=None):
        """Get hidden text blocks for an entry (DM only)"""
        entry = self.get_object()
        
        if not request.user.is_dm:
            return Response(
                {"error": "Only DMs can view hidden content"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        hidden_blocks = entry.hidden_blocks.all()
        serializer = HiddenTextBlockSerializer(hidden_blocks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def cross_references(self, request, pk=None):
        """Get cross-references for an entry"""
        entry = self.get_object()
        outgoing = entry.outgoing_references.all()
        incoming = entry.incoming_references.all()
        
        outgoing_serializer = CrossReferenceSerializer(outgoing, many=True)
        incoming_serializer = CrossReferenceSerializer(incoming, many=True)
        
        return Response({
            'outgoing': outgoing_serializer.data,
            'incoming': incoming_serializer.data
        })

class HiddenTextBlockViewSet(viewsets.ModelViewSet):
    """
    ViewSet for HiddenTextBlock model.
    Only DMs can access hidden text blocks.
    """
    
    queryset = HiddenTextBlock.objects.all()
    serializer_class = HiddenTextBlockSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Only DMs can see hidden text blocks"""
        if not self.request.user.is_dm:
            return HiddenTextBlock.objects.none()
        return super().get_queryset()
    
    def perform_create(self, serializer):
        """Ensure only DMs can create hidden blocks"""
        if not self.request.user.is_dm:
            raise permissions.PermissionDenied("Only DMs can create hidden content")
        serializer.save()

class CrossReferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CrossReference model.
    Allows users to create cross-references between entries.
    """
    
    queryset = CrossReference.objects.all()
    serializer_class = CrossReferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Use different serializer for creation"""
        if self.action == 'create':
            return CrossReferenceCreateSerializer
        return CrossReferenceSerializer
    
    def perform_create(self, serializer):
        """Validate that user can create cross-references"""
        source_entry = serializer.validated_data['source_entry']
        target_entry = serializer.validated_data['target_entry']
        
        # Users can only create cross-references from their own entries
        if source_entry.owner != self.request.user:
            raise permissions.PermissionDenied("You can only create cross-references from your own entries")
        
        serializer.save()
