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

   
    admin_user, created_admin = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@fittrack.local', 'first_name': 'Administrador'}
    )
    if created_admin:
        admin_user.set_password('admin123')
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
        Token.objects.get_or_create(user=admin_user)
        print("Superusuario 'admin' creado con contraseña 'admin123'.")
    else:
        print("Superusuario 'admin' ya existía.")

    
    demo_user, created_demo = User.objects.get_or_create(
        username='demo',
        defaults={'email': 'demo@fittrack.local', 'first_name': 'Nicolas', 'last_name': 'Atleta'}
    )
    if created_demo:
        demo_user.set_password('demo1234')
        demo_user.save()
        Token.objects.get_or_create(user=demo_user)
        print("Usuario 'demo' creado con contraseña 'demo1234'.")
    else:
        print("Usuario 'demo' ya existía.")

   
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
            user=demo_user,
            exercise_name=item['exercise_name'],
            date=item['date'],
            defaults=item
        )

    print(f"Total registros cargados para usuario 'demo': {WorkoutLog.objects.filter(user=demo_user).count()}")
    print("Datos iniciales listos con exito.")


if __name__ == '__main__':
    seed()
