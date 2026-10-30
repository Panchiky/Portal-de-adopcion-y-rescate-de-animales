import React from 'react';
import { gridOutline, documentTextOutline, pawOutline, calendarOutline, personOutline } from 'ionicons/icons';
import NavegacionLayout, { ItemNavegacion } from './NavegacionLayout';

const ITEMS_ADMIN: ItemNavegacion[] = [
  { ruta: '/admin/resumen', etiqueta: 'Resumen', icono: gridOutline },
  { ruta: '/admin/solicitudes', etiqueta: 'Solicitudes', icono: documentTextOutline },
  { ruta: '/admin/animales', etiqueta: 'Animales', icono: pawOutline },
  { ruta: '/admin/agenda', etiqueta: 'Agenda', icono: calendarOutline },
  { ruta: '/admin/perfil', etiqueta: 'Perfil', icono: personOutline }
];

interface AdminLayoutProps {
  titulo: string;
  volverA?: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ titulo, volverA, children }) => (
  <NavegacionLayout titulo={titulo} items={ITEMS_ADMIN} volverA={volverA}>
    {children}
  </NavegacionLayout>
);

export default AdminLayout;
