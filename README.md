

Presentamos FitnessTracker
Aplicación web para el registro y seguimiento de entrenamientos físicos personales.  



Tecnologias usadas

Para el Backend
- Python 3.12
- Django 6.1.3
- Django REST Framework 3.18.3
- django-cors-headers 4.9.0
- SQLite (base de datos local)

Y para el Frontend
- React 18
- Vite 6
- CSS personalizado



Funcionalidades

- Registro e inicio de sesión con autenticación por token
- CRUD completo de registros de entrenamiento
- Filtro y búsqueda de ejercicios
- Vista de estadísticas personales
- Interfaz intuitiva para cualquier usuario



Endpoints API que pregunto en la prueba 



 POST /api/auth/register/ Registrar usuario 
 POST /api/auth/login/ Iniciar sesión 
 POST /api/auth/logout/ Cerrar sesión 
 GET /api/auth/me/ Ver datos del usuario actual 
 GET /api/workouts/ Listar entrenamientos 
 POST /api/workouts/ Crear entrenamiento 
 GET /api/workouts/{id}/ Ver entrenamiento 
 PUT /api/workouts/{id}/  Editar entrenamiento 
 DELETE /api/workouts/{id}/ Eliminar entrenamiento 



Instalación y uso

Backend

cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver


Frontend


cd frontend
npm install
npm run dev


Abrir en el navegador: `http://localhost:5173`



Estructura del proyecto

FitnessTracker/
├── backend/
│   ├── fittrack/          > Configuración Django
│   ├── workouts/          >App principal (modelos, vistas, serializers)
│   ├── manage.py
│   ├── requirements.txt
│   └── seed_data.py       >Script para poblar la base de datos
└── frontend/
    ├── public/
    └── src/
        ├── components/    > BarraNav, ModalEjercicio, ModalEliminar, etc.
        ├── context/       > AuthContext
        ├── pages/         > LoginPage, DashboardPage
        └── services/      > api.js o mejor dicho el cliente HTTP
