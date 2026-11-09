from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class WorkoutLog(models.Model):
    MUSCLE_GROUP_CHOICES = [
        ('PECHO', 'Pecho'),
        ('ESPALDA', 'Espalda'),
        ('PIERNAS', 'Piernas'),
        ('HOMBROS', 'Hombros'),
        ('BRAZOS', 'Brazos'),
        ('CORE', 'Core / Abdominales'),
        ('CARDIO', 'Cardio'),
        ('OTRO', 'Otro'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='workout_logs',
        help_text='Usuario que registro el entrenamiento'
    )
    exercise_name = models.CharField(
        max_length=100,
        verbose_name='Nombre del Ejercicio'
    )
    muscle_group = models.CharField(
        max_length=20,
        choices=MUSCLE_GROUP_CHOICES,
        default='PECHO',
        verbose_name='Grupo Muscular'
    )
    date = models.DateField(
        default=timezone.now,
        verbose_name='Fecha'
    )
    sets = models.PositiveIntegerField(
        verbose_name='Series'
    )
    reps = models.PositiveIntegerField(
        verbose_name='Repeticiones'
    )
    weight_kg = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name='Peso (kg)'
    )
    notes = models.TextField(
        blank=True,
        default='',
        verbose_name='Notas / Observaciones'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creacion'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Ultima actualizacion'
    )

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Registro de Entrenamiento'
        verbose_name_plural = 'Registros de Entrenamientos'

    def __str__(self):
        return f"{self.date} - {self.exercise_name} ({self.sets}x{self.reps} @ {self.weight_kg}kg) [{self.user.username}]"
