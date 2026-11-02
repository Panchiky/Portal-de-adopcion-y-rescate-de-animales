import { api } from './api';
import { formatearFecha } from './postulacionesService';

export interface Alerta {
  id: number;
  titulo: string;
  detalle: string;
  fecha: string;
  leida: boolean;
  ruta?: string;
}

interface NotificacionApi {
  id: number;
  titulo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  fecha: string;
}

export const obtenerAlertas = async (): Promise<Alerta[]> => {
  const { data } = await api.get<{ data: NotificacionApi[] }>('/notificaciones');
  return data.data.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    detalle: n.mensaje,
    fecha: formatearFecha(n.fecha),
    leida: n.leida,
    ruta: n.enlace ?? undefined,
  }));
};

export const marcarAlertaLeida = async (id: number) => {
  await api.patch(`/notificaciones/${id}/leida`);
};
