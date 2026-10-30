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

export const rutaInicioPorRol = (rol: Rol | null) => (rol === 'admin' ? '/admin/resumen' : '/catalogo');
