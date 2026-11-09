from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import WorkoutLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class WorkoutLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = WorkoutLog
        fields = [
            'id',
            'user',
            'exercise_name',
            'muscle_group',
            'date',
            'sets',
            'reps',
            'weight_kg',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_exercise_name(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("El nombre del ejercicio no puede estar vacio.")
        if len(trimmed) < 2:
            raise serializers.ValidationError("El nombre del ejercicio debe tener al menos 2 caracteres.")
        return trimmed

    def validate_sets(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Las series deben ser un numero mayor a 0.")
        if value > 50:
            raise serializers.ValidationError("El numero maximo de series permitidas es 50.")
        return value

    def validate_reps(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Las repeticiones deben ser un numero mayor a 0.")
        if value > 200:
            raise serializers.ValidationError("El numero maximo de repeticiones permitidas es 200.")
        return value

    def validate_weight_kg(self, value):
        if value is None or value < 0:
            raise serializers.ValidationError("El peso no puede ser negativo.")
        if value > 500:
            raise serializers.ValidationError("El peso maximo permitido es 500 kg.")
        return value

    def validate_date(self, value):
        # Permite hasta manana para evitar problemas de zona horaria local
        tomorrow = timezone.now().date() + timezone.timedelta(days=1)
        if value > tomorrow:
            raise serializers.ValidationError("La fecha no puede ser futura.")
        return value
