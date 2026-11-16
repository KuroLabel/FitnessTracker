from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import WorkoutLog
from .serializers import WorkoutLogSerializer, UserSerializer


class WorkoutLogViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        print("-> sacaste los registro exito")
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        print("-> exito al ver la ficha (200)")
        return response

    def get_object(self):
        try:
            return super().get_object()
        except Exception:
            print("-> error 404 no existe")
            raise

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("-> mandando datos errones (error 400)")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        print("-> Guardado perfecto")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        print("-> actualizando")
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        print("-> borrado con exito")
        return response


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        print("-> error 400 mal ahi")
        return Response(
            {'error': 'Debe proporcionar tanto usuario como contraseña.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_active:
            print("-> error 401 no puedes meterte a los datos")
            return Response(
                {'error': 'Esta cuenta de usuario esta inactiva.'},
                status=status.HTTP_403_FORBIDDEN
            )
        token, _ = Token.objects.get_or_create(user=user)
        print("-> Iniciando 🔥")
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Inicio de sesion exitoso.'
        }, status=status.HTTP_200_OK)
    else:
        print("-> error 400 mal ahi")
        return Response(
            {'error': 'Credenciales invalidas. Verifique su usuario y contraseña.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
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
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
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
