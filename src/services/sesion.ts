const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

export type RolApi = 'USUARIO' | 'ADMIN';

export interface UsuarioSesion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolApi;
  refugioId: number | null;
  telefono: string | null;
  comuna: string | null;
}

export const guardarSesion = (token: string, usuario: UsuarioSesion) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
};

export const limpiarSesion = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
};

export const obtenerToken = () => localStorage.getItem(TOKEN_KEY);

export const obtenerUsuario = (): UsuarioSesion | null => {
  const guardado = localStorage.getItem(USUARIO_KEY);
  return guardado ? (JSON.parse(guardado) as UsuarioSesion) : null;
};

// Lee la fecha de expiración del JWT (sin verificar la firma, eso lo hace el backend)
export const tokenVigente = (token: string | null) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
