from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .tasks import send_welcome_email

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'full_name', 'email', 'password')

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        parts = validated_data['full_name'].strip().split(' ', 1)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=parts[0],
            last_name=parts[1] if len(parts) > 1 else '',
            role='customer',
        )
        try:
            send_welcome_email.delay(user.id)
        except Exception:
            pass
        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'full_name', 'phone_number', 'role')
        read_only_fields = ('id', 'email', 'role')

    def get_full_name(self, obj) -> str:
        return f"{obj.first_name} {obj.last_name}".strip()

