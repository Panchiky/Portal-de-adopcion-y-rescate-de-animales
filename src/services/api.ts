import axios, { AxiosError } from 'axios';
import { limpiarSesion, obtenerToken } from './sesion';

interface ErrorApi {
  ok: false;
  error: { mensaje: string; detalles?: { campo: string; mensaje: string }[] };
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Agrega el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 con una sesión abierta, el token venció o es inválido
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError<ErrorApi>) => {
    const esLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && obtenerToken() && !esLogin) {
      limpiarSesion();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

// Convierte cualquier error de Axios en un mensaje para mostrar al usuario
export const mensajeError = (error: unknown) => {
  if (axios.isAxiosError<ErrorApi>(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa que la API esté encendida.';
    }
    const { mensaje, detalles } = error.response.data?.error ?? {};
    if (detalles?.length) {
      return detalles.map((d) => d.mensaje).join('. ');
    }
    if (mensaje) {
      return mensaje;
    }
  }
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
};
