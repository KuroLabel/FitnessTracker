import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fittrack.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from workouts.models import WorkoutLog

client = APIClient()

print("Tirando los datos del sistema.. 🍀🗽💸\n")

print("[1/11] Probando el login con la cuenta...")
res = client.post('/api/auth/login/', {'username': 'nicolas', 'password': 'nicolas123'}, format='json')
assert res.status_code == 200, f"Error: {res.status_code}"
token = res.data['token']

print("\n[2/11] Metiendo la contraseña incorrecta")
res_fail = client.post('/api/auth/login/', {'username': 'nicolas', 'password': 'wrongpassword'}, format='json')
assert res_fail.status_code == 400

print("\n[3/11] Intentando colarse a los datos mal ahi")
unauth_client = APIClient()
res_unauth = unauth_client.get('/api/workouts/')
assert res_unauth.status_code == 401
print("       -> error 401 no puedes meterte a los datos")

print("\n[4/11] Sacando la lista de todos los entrenamientos...")
client.credentials(HTTP_AUTHORIZATION='Token ' + token)
res_list = client.get('/api/workouts/')
assert res_list.status_code == 200
assert len(res_list.data) > 0
first_id = res_list.data[0]['id']

print(f"\n[5/11] Viendo la ficha del ejercicio.. (ID: {first_id})")
res_detail = client.get(f'/api/workouts/{first_id}/')
assert res_detail.status_code == 200

print("\n[6/11] Buscando un ejercicio que no existe")
res_404 = client.get('/api/workouts/99999/')
assert res_404.status_code == 404

print("\n[7/11] Mandando datos erroneos")
res_bad_post = client.post('/api/workouts/', {
    'exercise_name': '',
    'muscle_group': 'PECHO',
    'date': '2026-11-09',
    'sets': -1,
    'reps': 0,
    'weight_kg': -10
}, format='json')
assert res_bad_post.status_code == 400
assert 'exercise_name' in res_bad_post.data
assert 'sets' in res_bad_post.data

print("\n[8/11] Guardando ejercicio nuevo...")
res_create = client.post('/api/workouts/', {
    'exercise_name': 'Curl de Biceps con Barra Z',
    'muscle_group': 'BRAZOS',
    'date': '2026-11-09',
    'sets': 4,
    'reps': 12,
    'weight_kg': 35.5,
    'notes': 'Contracción máxima al subir'
}, format='json')
assert res_create.status_code == 201
new_id = res_create.data['id']

print(f"\n[9/11] Modificando el ejercicio (ID: {new_id})...")
res_update = client.put(f'/api/workouts/{new_id}/', {
    'exercise_name': 'Curl de Biceps con Mancuernas Alterno',
    'muscle_group': 'BRAZOS',
    'date': '2026-11-09',
    'sets': 4,
    'reps': 10,
    'weight_kg': 16.0,
    'notes': 'Modificado con mancuernas'
}, format='json')
assert res_update.status_code == 200

print(f"\n[10/11] Borrando el ejercicio (ID: {new_id})...")
res_del = client.delete(f'/api/workouts/{new_id}/')
assert res_del.status_code == 204

print(f"\n[11/11] Revisando que se haya borrado el dato ...")
res_check_del = client.get(f'/api/workouts/{new_id}/')
assert res_check_del.status_code == 404

print("\n Pruebas exitosas 🍀🗽💸")
