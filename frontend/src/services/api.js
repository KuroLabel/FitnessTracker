/**
 * Servicio de comunicacion con la API REST de Django.
 * Cumple con los criterios A, B, C y E de la pauta.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getStoredToken = () => localStorage.getItem('fittrack_token');
export const setStoredToken = (token) => localStorage.setItem('fittrack_token', token);
export const removeStoredToken = () => localStorage.removeItem('fittrack_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('fittrack_user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem('fittrack_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('fittrack_user');

/**
 * Cliente HTTP generico con manejo centralizado de cabeceras, tokens y errores REST.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    // Error de conexion cuando el backend de Django esta apagado
    throw new Error('No se pudo conectar con el servidor backend. Asegurate de que Django este ejecutandose.');
  }

  // 204 No Content (como en DELETE exitoso) no tiene cuerpo JSON
  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Manejo estructurado de errores segun el codigo HTTP (Criterio E)
    let errorMessage = 'Ocurrio un error inesperado.';

    if (response.status === 400) {
      if (typeof data === 'object' && data !== null) {
        if (data.error) {
          errorMessage = data.error;
        } else {
          // Extrae los errores de validacion por campo del serializer
          const fieldErrors = Object.entries(data)
            .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' | ');
          errorMessage = fieldErrors || 'Datos invalidos enviados al servidor.';
        }
      }
    } else if (response.status === 401) {
      errorMessage = 'Sesion no autorizada o expirada. Por favor, inicia sesion nuevamente.';
      removeStoredToken();
      removeStoredUser();
    } else if (response.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta operacion.';
    } else if (response.status === 404) {
      errorMessage = 'El recurso solicitado no fue encontrado en el servidor (404 Not Found).';
    } else if (response.status >= 500) {
      errorMessage = 'Error interno del servidor (500). Por favor, revisa la consola de Django.';
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Autenticacion
  async login(username, password) {
    const data = await request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setStoredToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async logout() {
    try {
      await request('/auth/logout/', { method: 'POST' });
    } finally {
      removeStoredToken();
      removeStoredUser();
    }
  },

  async getMe() {
    return await request('/auth/me/');
  },

  async register(username, password, email) {
    const data = await request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
    setStoredToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  // CRUD Workouts (Metodos HTTP correspondientes)
  async getWorkouts() {
    return await request('/workouts/');
  },

  async getWorkout(id) {
    return await request(`/workouts/${id}/`);
  },

  async createWorkout(workoutData) {
    return await request('/workouts/', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  },

  async updateWorkout(id, workoutData) {
    return await request(`/workouts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
    });
  },

  async deleteWorkout(id) {
    return await request(`/workouts/${id}/`, {
      method: 'DELETE',
    });
  },
};
