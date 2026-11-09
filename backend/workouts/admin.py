from django.contrib import admin
from .models import WorkoutLog


@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ('date', 'exercise_name', 'muscle_group', 'sets', 'reps', 'weight_kg', 'user')
    list_filter = ('muscle_group', 'date', 'user')
    search_fields = ('exercise_name', 'notes', 'user__username')
