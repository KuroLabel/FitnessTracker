
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

    throw new Error('No se pudo conectar con el servidor. Por favor, intenta nuevamente más tarde.');
  }

  
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
 
    let errorMessage = 'Ocurrio un error inesperado.';

    if (response.status === 400) {
      if (typeof data === 'object' && data !== null) {
        if (data.error) {
          errorMessage = data.error;
        } else {

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
      errorMessage = 'El recurso solicitado no fue encontrado.';
    } else if (response.status >= 500) {
      errorMessage = 'Ocurrió un error en el servidor. Por favor, intenta más tarde.';
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {

  async login(username, password) {
    try {
      const data = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setStoredToken(data.token);
      setStoredUser(data.user);
      console.log("-> Iniciando 🔥");
      return data;
    } catch (err) {
      console.log("-> error 400 mal ahi");
      throw err;
    }
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


  async getWorkouts() {
    const data = await request('/workouts/');
    console.log("-> sacaste los registro exito");
    return data;
  },

  async getWorkout(id) {
    const data = await request(`/workouts/${id}/`);
    console.log("-> exito al ver la ficha (200)");
    return data;
  },

  async createWorkout(workoutData) {
    const data = await request('/workouts/', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
    console.log("-> Guardado perfecto");
    return data;
  },

  async updateWorkout(id, workoutData) {
    console.log("-> actualizando");
    return await request(`/workouts/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
    });
  },

  async deleteWorkout(id) {
    const data = await request(`/workouts/${id}/`, {
      method: 'DELETE',
    });
    console.log("-> borrado con exito");
    return data;
  },
};
