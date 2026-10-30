import React from 'react';
import { Navigate, useResolvedPath } from 'react-router-dom';
import { estaAutenticado, obtenerRol, rutaInicioPorRol } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'user' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const rutaActual = useResolvedPath('.').pathname;
  const userRole = obtenerRol();

  if (!estaAutenticado()) {
    return <Navigate to="/login" replace state={{ from: rutaActual }} />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={rutaInicioPorRol(userRole)} replace />;
  }

  return <>{children}</>;
};
