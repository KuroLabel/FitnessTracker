import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fittrack.settings')
django.setup()

from django.contrib.auth.models import User
from workouts.models import WorkoutLog
from rest_framework.authtoken.models import Token


def seed():
    print("Iniciando carga de datos iniciales...")

    # Crear superusuario admin
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@fittrack.local', 'first_name': 'Administrador'}
    )
    admin_user.set_password('admin123')
    admin_user.is_superuser = True
    admin_user.is_staff = True
    admin_user.save()
    Token.objects.get_or_create(user=admin_user)
    print("Superusuario 'admin' configurado con contraseña 'admin123'.")

    # Crear usuario nicolas con contraseña nicolas123
    nic_user, _ = User.objects.get_or_create(
        username='nicolas',
        defaults={'email': 'nicolas@fittrack.local', 'first_name': 'Nicolas'}
    )
    nic_user.set_password('nicolas123')
    nic_user.first_name = 'Nicolas'
    nic_user.save()
    Token.objects.get_or_create(user=nic_user)
    print("Usuario 'nicolas' configurado con contraseña 'nicolas123'.")

    # Si existian datos del usuario demo anterior, reasignarlos a nicolas
    demo_user = User.objects.filter(username='demo').first()
    if demo_user:
        WorkoutLog.objects.filter(user=demo_user).update(user=nic_user)
        print("Registros existentes migrados al usuario 'nicolas'.")

    # Crear registros de entrenamiento de prueba para nicolas
    today = date.today()
    sample_workouts = [
        {
            'exercise_name': 'Press de Banca Plano',
            'muscle_group': 'PECHO',
            'date': today - timedelta(days=2),
            'sets': 4,
            'reps': 8,
            'weight_kg': 80.0,
            'notes': 'Buena congestión, última serie con pausa en el pecho.'
        },
        {
            'exercise_name': 'Aperturas con Mancuernas',
            'muscle_group': 'PECHO',
            'date': today - timedelta(days=2),
            'sets': 3,
            'reps': 12,
            'weight_kg': 18.0,
            'notes': 'Enfoque en estiramiento controlado.'
        },
        {
            'exercise_name': 'Sentadilla Trasera con Barra',
            'muscle_group': 'PIERNAS',
            'date': today - timedelta(days=1),
            'sets': 5,
            'reps': 5,
            'weight_kg': 110.0,
            'notes': 'Profundidad bajo la paralela, RPE 8.5.'
        },
        {
            'exercise_name': 'Prensa de Piernas 45°',
            'muscle_group': 'PIERNAS',
            'date': today - timedelta(days=1),
            'sets': 4,
            'reps': 10,
            'weight_kg': 200.0,
            'notes': 'Cadencia lenta en fase excéntrica.'
        },
        {
            'exercise_name': 'Dominadas Pronadas',
            'muscle_group': 'ESPALDA',
            'date': today,
            'sets': 4,
            'reps': 8,
            'weight_kg': 0.0,
            'notes': 'Peso corporal, rango de movimiento completo.'
        },
        {
            'exercise_name': 'Remo con Barra',
            'muscle_group': 'ESPALDA',
            'date': today,
            'sets': 4,
            'reps': 10,
            'weight_kg': 70.0,
            'notes': 'Tronco a 45 grados, retracción escapular.'
        },
        {
            'exercise_name': 'Press Militar con Barra',
            'muscle_group': 'HOMBROS',
            'date': today,
            'sets': 3,
            'reps': 8,
            'weight_kg': 50.0,
            'notes': 'Core firme sin hiperextensión lumbar.'
        },
    ]

    for item in sample_workouts:
        WorkoutLog.objects.get_or_create(
            user=nic_user,
            exercise_name=item['exercise_name'],
            date=item['date'],
            defaults=item
        )

    print(f"Total registros para usuario 'nicolas': {WorkoutLog.objects.filter(user=nic_user).count()}")
    print("Datos iniciales listos con éxito.")


if __name__ == '__main__':
    seed()
