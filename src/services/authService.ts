import { api } from './api';
import { guardarSesion, limpiarSesion, obtenerToken, obtenerUsuario, tokenVigente, UsuarioSesion } from './sesion';

export type Rol = 'user' | 'admin';

interface RespuestaAuth {
  ok: true;
  data: { token: string; usuario: UsuarioSesion };
}

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

const rolDe = (usuario: UsuarioSesion): Rol => (usuario.rol === 'ADMIN' ? 'admin' : 'user');

export const iniciarSesion = async (email: string, password: string): Promise<Rol> => {
  const { data } = await api.post<RespuestaAuth>('/auth/login', { email, password });
  guardarSesion(data.data.token, data.data.usuario);
  return rolDe(data.data.usuario);
};

export const registrarse = async (datos: DatosRegistro): Promise<Rol> => {
  const { data } = await api.post<RespuestaAuth>('/auth/registro', datos);
  guardarSesion(data.data.token, data.data.usuario);
  return rolDe(data.data.usuario);
};

export const cerrarSesion = () => limpiarSesion();

export const estaAutenticado = () => tokenVigente(obtenerToken());

export const obtenerRol = (): Rol | null => {
  const usuario = obtenerUsuario();
  return usuario ? rolDe(usuario) : null;
};

export const obtenerEmail = () => obtenerUsuario()?.email ?? '';

export interface DatosPerfil {
  nombre: string;
  apellido: string;
  telefono: string;
  comuna: string;
}

// Mantiene los datos guardados en la sesión iguales a los del backend
const refrescarUsuarioSesion = (usuario: UsuarioSesion) => {
  const token = obtenerToken();
  if (token) guardarSesion(token, usuario);
};

// GET /auth/perfil
export const obtenerPerfil = async (): Promise<UsuarioSesion> => {
  const { data } = await api.get<{ data: UsuarioSesion }>('/auth/perfil');
  refrescarUsuarioSesion(data.data);
  return data.data;
};

// PATCH /auth/perfil (FT-07)
export const actualizarPerfil = async (datos: DatosPerfil): Promise<UsuarioSesion> => {
  const { data } = await api.patch<{ data: UsuarioSesion }>('/auth/perfil', datos);
  refrescarUsuarioSesion(data.data);
  return data.data;
};

// PATCH /auth/password (FT-08). Si la contraseña actual no coincide, el backend responde 400 (no cierra la sesión)
export const cambiarPassword = async (passwordActual: string, passwordNueva: string) => {
  await api.patch('/auth/password', { passwordActual, passwordNueva });
};

export const rutaInicioPorRol = (rol: Rol | null) => (rol === 'admin' ? '/admin/resumen' : '/catalogo');
