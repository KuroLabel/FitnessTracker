from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import WorkoutLog
from .serializers import WorkoutLogSerializer, UserSerializer


class WorkoutLogViewSet(viewsets.ModelViewSet):
    """
    CRUD completo y RESTful para registros de entrenamiento.
    Endpoints:
      - GET    /api/workouts/     -> Listar registros (200 OK)
      - POST   /api/workouts/     -> Crear registro (201 Created)
      - GET    /api/workouts/<id>/ -> Detalle (200 OK / 404 Not Found)
      - PUT    /api/workouts/<id>/ -> Actualizar completo (200 OK)
      - PATCH  /api/workouts/<id>/ -> Actualizar parcial (200 OK)
      - DELETE /api/workouts/<id>/ -> Eliminar (204 No Content)
    """
    serializer_class = WorkoutLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Cada usuario autenticado gestiona solo sus propios registros
        return WorkoutLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Asocia automaticamente el registro al usuario autenticado
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    Valida credenciales contra la BD (password hasheado) y retorna token de sesion.
    Retorna 200 OK con token y datos de usuario o 400 Bad Request si fallan las credenciales.
    """
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response(
            {'error': 'Debe proporcionar tanto usuario como contraseña.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Django verifica usuario y contrasena (con hash PBKDF2/SHA256)
    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_active:
            return Response(
                {'error': 'Esta cuenta de usuario esta inactiva.'},
                status=status.HTTP_403_FORBIDDEN
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Inicio de sesion exitoso.'
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Credenciales invalidas. Verifique su usuario y contraseña.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Cierre de sesion: elimina el token de la base de datos para invalidarlo.
    """
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response(
        {'message': 'Sesion cerrada exitosamente.'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    """
    Retorna la informacion del usuario actualmente autenticado con su token.
    """
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """
    Permite registrar un nuevo usuario para probar el sistema facilmente.
    """
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    email = request.data.get('email', '').strip()

    if not username or not password:
        return Response(
            {'error': 'Nombre de usuario y contraseña son obligatorios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 6:
        return Response(
            {'error': 'La contraseña debe tener al menos 6 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': f'El nombre de usuario "{username}" ya esta en uso.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, password=password, email=email)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
        'message': 'Usuario registrado exitosamente.'
    }, status=status.HTTP_201_CREATED)
