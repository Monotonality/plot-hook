from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, UserProfile, Campaign
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, CampaignSerializer, CampaignCreateSerializer,
    CampaignUpdateSerializer
)
from django.db.models import Q

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model.
    Provides user management functionality.
    """
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'is_active']
    
    def get_queryset(self):
        """Filter queryset based on user permissions"""
        user = self.request.user
        
        # DMs can see all users
        if user.is_dm:
            return User.objects.all()
        
        # Players can only see themselves and other players
        return User.objects.filter(role='player')
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """Update current user's profile"""
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration.
    """
    
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(generics.GenericAPIView):
    """
    View for user login.
    """
    
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile model.
    """
    
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own profile"""
        return UserProfile.objects.filter(user=self.request.user)

class CampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Campaign model.
    """
    
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'dm']
    
    def get_queryset(self):
        """Filter campaigns based on user participation"""
        user = self.request.user
        return Campaign.objects.filter(
            Q(dm=user) | Q(players=user)
        ).distinct()
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return CampaignCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CampaignUpdateSerializer
        return CampaignSerializer
    
    def perform_create(self, serializer):
        """Set the DM to the current user"""
        serializer.save(dm=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_player(self, request, pk=None):
        """Add a player to the campaign"""
        campaign = self.get_object()
        
        # Only the DM can add players
        if campaign.dm != request.user:
            return Response(
                {"error": "Only the DM can add players"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        player_id = request.data.get('player_id')
        if not player_id:
            return Response(
                {"error": "player_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            player = User.objects.get(id=player_id, role='player')
            campaign.players.add(player)
            return Response({"message": "Player added successfully"})
        except User.DoesNotExist:
            return Response(
                {"error": "Player not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_player(self, request, pk=None):
        """Remove a player from the campaign"""
        campaign = self.get_object()
        
        # Only the DM can remove players
        if campaign.dm != request.user:
            return Response(
                {"error": "Only the DM can remove players"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        player_id = request.data.get('player_id')
        if not player_id:
            return Response(
                {"error": "player_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            player = User.objects.get(id=player_id)
            campaign.players.remove(player)
            return Response({"message": "Player removed successfully"})
        except User.DoesNotExist:
            return Response(
                {"error": "Player not found"},
                status=status.HTTP_404_NOT_FOUND
            )
