from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WorkoutLogViewSet,
    login_view,
    logout_view,
    me_view,
    register_view
)

router = DefaultRouter()
router.register(r'workouts', WorkoutLogViewSet, basename='workout')

urlpatterns = [
    # Endpoints del CRUD RESTful
    path('', include(router.urls)),
    
    # Endpoints de Autenticacion
    path('auth/login/', login_view, name='auth-login'),
    path('auth/logout/', logout_view, name='auth-logout'),
    path('auth/me/', me_view, name='auth-me'),
    path('auth/register/', register_view, name='auth-register'),
]
