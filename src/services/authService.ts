export type Rol = 'user' | 'admin';

const ADMIN_EMAIL = 'admin@patitasgo.cl';

export const iniciarSesion = (email: string): Rol => {
  const rol: Rol = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user';
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userRole', rol);
  localStorage.setItem('userEmail', email);
  return rol;
};

export const cerrarSesion = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
};

export const estaAutenticado = () => localStorage.getItem('isAuthenticated') === 'true';

export const obtenerRol = () => localStorage.getItem('userRole') as Rol | null;

export const obtenerEmail = () => localStorage.getItem('userEmail') ?? '';

export const rutaInicioPorRol = (rol: Rol | null) => (rol === 'admin' ? '/admin/resumen' : '/catalogo');
