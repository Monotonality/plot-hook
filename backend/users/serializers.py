from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, Campaign

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    is_dm = serializers.ReadOnlyField()
    is_player = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'bio', 'avatar', 'date_of_birth',
            'is_active', 'is_dm', 'is_player', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'bio'
        ]
    
    def validate(self, data):
        """Validate that passwords match"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        """Create a new user"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate user credentials"""
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled")
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Must include username and password")

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'favorite_genre', 'experience_level',
            'timezone', 'notification_preferences'
        ]

class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaign model"""
    
    dm = UserSerializer(read_only=True)
    players = UserSerializer(many=True, read_only=True)
    participants_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'description', 'dm', 'players',
            'is_active', 'created_at', 'updated_at', 'participants_count'
        ]
        read_only_fields = ['dm', 'created_at', 'updated_at']
    
    def get_participants_count(self, obj):
        """Get total number of participants"""
        return len(obj.all_participants)

class CampaignCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating campaigns"""
    
    class Meta:
        model = Campaign
        fields = ['name', 'description']
    
    def create(self, validated_data):
        """Create a new campaign with current user as DM"""
        validated_data['dm'] = self.context['request'].user
        return super().create(validated_data)

class CampaignUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating campaigns"""
    
    class Meta:
        model = Campaign
        fields = ['name', 'description', 'is_active']
