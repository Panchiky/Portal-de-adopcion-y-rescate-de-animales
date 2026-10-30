import React from 'react';
import { searchOutline, documentTextOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import NavegacionLayout, { ItemNavegacion } from './NavegacionLayout';

const ITEMS_USUARIO: ItemNavegacion[] = [
  { ruta: '/catalogo', etiqueta: 'Explorar', icono: searchOutline },
  { ruta: '/usuario/postulaciones', etiqueta: 'Postulaciones', icono: documentTextOutline },
  { ruta: '/usuario/alertas', etiqueta: 'Alertas', icono: notificationsOutline },
  { ruta: '/usuario/perfil', etiqueta: 'Perfil', icono: personOutline }
];

interface UsuarioLayoutProps {
  titulo: string;
  volverA?: string;
  children: React.ReactNode;
}

const UsuarioLayout: React.FC<UsuarioLayoutProps> = ({ titulo, volverA, children }) => (
  <NavegacionLayout titulo={titulo} items={ITEMS_USUARIO} volverA={volverA}>
    {children}
  </NavegacionLayout>
);

export default UsuarioLayout;
