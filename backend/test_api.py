import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fittrack.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from workouts.models import WorkoutLog

client = APIClient()

print("--- 1. Test Login (Credenciales validas) ---")
res = client.post('/api/auth/login/', {'username': 'nicolas', 'password': 'nicolas123'}, format='json')
print(f"Status: {res.status_code}")
assert res.status_code == 200, f"Expected 200, got {res.status_code}"
token = res.data['token']
print(f"Token obtenido: {token[:10]}...")

print("\n--- 2. Test Login (Credenciales invalidas -> 400) ---")
res_fail = client.post('/api/auth/login/', {'username': 'nicolas', 'password': 'wrongpassword'}, format='json')
print(f"Status: {res_fail.status_code}, Detalle: {res_fail.data}")
assert res_fail.status_code == 400

print("\n--- 3. Test Endpoints Protegidos sin Token (-> 401) ---")
unauth_client = APIClient()
res_unauth = unauth_client.get('/api/workouts/')
print(f"Status sin token: {res_unauth.status_code}, Detalle: {res_unauth.data}")
assert res_unauth.status_code == 401

print("\n--- 4. Test GET /api/workouts/ (Listar con Token -> 200) ---")
client.credentials(HTTP_AUTHORIZATION='Token ' + token)
res_list = client.get('/api/workouts/')
print(f"Status: {res_list.status_code}, Cantidad de registros: {len(res_list.data)}")
assert res_list.status_code == 200
assert len(res_list.data) > 0
first_id = res_list.data[0]['id']

print(f"\n--- 5. Test GET /api/workouts/{first_id}/ (Detalle -> 200) ---")
res_detail = client.get(f'/api/workouts/{first_id}/')
print(f"Status: {res_detail.status_code}, Ejercicio: {res_detail.data['exercise_name']}")
assert res_detail.status_code == 200

print("\n--- 6. Test GET /api/workouts/99999/ (Recurso inexistente -> 404) ---")
res_404 = client.get('/api/workouts/99999/')
print(f"Status: {res_404.status_code}, Detalle: {res_404.data}")
assert res_404.status_code == 404

print("\n--- 7. Test POST /api/workouts/ (Validaciones fallidas -> 400) ---")
res_bad_post = client.post('/api/workouts/', {
    'exercise_name': '',  # Vacio
    'muscle_group': 'PECHO',
    'date': '2026-11-09',
    'sets': -1,  # Invalido
    'reps': 0,   # Invalido
    'weight_kg': -10  # Invalido
}, format='json')
print(f"Status: {res_bad_post.status_code}, Errores en JSON: {res_bad_post.data}")
assert res_bad_post.status_code == 400
assert 'exercise_name' in res_bad_post.data
assert 'sets' in res_bad_post.data

print("\n--- 8. Test POST /api/workouts/ (Creacion valida -> 201) ---")
res_create = client.post('/api/workouts/', {
    'exercise_name': 'Curl de Biceps con Barra Z',
    'muscle_group': 'BRAZOS',
    'date': '2026-11-09',
    'sets': 4,
    'reps': 12,
    'weight_kg': 35.5,
    'notes': 'Contracción máxima al subir'
}, format='json')
print(f"Status: {res_create.status_code}, ID creado: {res_create.data['id']}")
assert res_create.status_code == 201
new_id = res_create.data['id']

print(f"\n--- 9. Test PUT /api/workouts/{new_id}/ (Actualizacion -> 200) ---")
res_update = client.put(f'/api/workouts/{new_id}/', {
    'exercise_name': 'Curl de Biceps con Mancuernas Alterno',
    'muscle_group': 'BRAZOS',
    'date': '2026-11-09',
    'sets': 4,
    'reps': 10,
    'weight_kg': 16.0,
    'notes': 'Modificado con mancuernas'
}, format='json')
print(f"Status: {res_update.status_code}, Nuevo nombre: {res_update.data['exercise_name']}")
assert res_update.status_code == 200
assert res_update.data['exercise_name'] == 'Curl de Biceps con Mancuernas Alterno'

print(f"\n--- 10. Test DELETE /api/workouts/{new_id}/ (Eliminar -> 204) ---")
res_del = client.delete(f'/api/workouts/{new_id}/')
print(f"Status: {res_del.status_code}")
assert res_del.status_code == 204

print("\n--- 11. Test GET registro eliminado -> 404 ---")
res_check_del = client.get(f'/api/workouts/{new_id}/')
print(f"Status: {res_check_del.status_code}")
assert res_check_del.status_code == 404

print("\n TODOS LOS TESTS DEL BACKEND PASARON EXITOSAMENTE (Criterios A, C, E cubiertos al 100%)")
