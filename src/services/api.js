import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/api", // Local API URL
  headers: { "Content-Type": "application/json" }
});

// Función para refrescar el token cuando sea necesario
const refreshAuthToken = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.refreshToken) {
      return null;
    }
    
    // Llamada al endpoint de refresh con el refreshToken
    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
      refreshToken: userData.refreshToken
    });
    
    if (response.data && response.data.token) {
      // Actualizar el token en localStorage
      const updatedUserData = {
        ...userData,
        token: response.data.token
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      return response.data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    return null;
  }
};

// Variable para controlar si ya estamos refrescando el token (evitar múltiples llamadas)
let isRefreshing = false;
// Cola de callbacks pendientes para ejecutar después de refrescar el token
let failedQueue = [];

// Procesar cola de solicitudes pendientes
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error al procesar datos de usuario:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si la API devolvió un error de token expirado (401) y no estamos ya en un intento de refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Si ya estamos refrescando el token, agregamos esta solicitud a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      // Marcamos que estamos en proceso de refrescar el token
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Intentar refrescar el token
        const newToken = await refreshAuthToken();
        
        if (newToken) {
          // Actualizar el token en la solicitud original y reintentarla
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Procesar las solicitudes en cola
          processQueue(null, newToken);
          
          return api(originalRequest);
        } else {
          // Si no se pudo obtener un nuevo token, redirigir al login
          localStorage.removeItem('user');
          processQueue(error, null);
          // En una aplicación real, redirigiríamos al login
          // window.location = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Limpiar datos de usuario
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Manejar otros errores específicos
    if (error.response) {
      // La petición se hizo y el servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 400:
          console.error('Error de petición:', error.response.data);
          break;
        case 403:
          console.error('Acceso prohibido:', error.response.data);
          break;
        case 404:
          console.error('Recurso no encontrado:', error.response.data);
          break;
        case 500:
          console.error('Error del servidor:', error.response.data);
          break;
        default:
          console.error(`Error HTTP ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error en la configuración de la petición
      console.error('Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;