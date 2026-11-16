from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root_view(request):
    return JsonResponse({
        'name': 'FitTrack REST API',
        'status': 'online',
        'version': '1.0.0',
        'documentation': 'FitTrack API Documentation',
        'endpoints': {
            'workouts_crud': '/api/workouts/',
            'auth_login': '/api/auth/login/',
            'auth_logout': '/api/auth/logout/',
            'auth_me': '/api/auth/me/',
            'admin_panel': '/admin/',
        },
        'frontend_url': 'http://localhost:5173/',
        'message': 'API en línea'
    })


urlpatterns = [
    path('', api_root_view, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('workouts.urls')),
]
