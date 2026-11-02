import { api } from './api';

export type EstadoPostulacion = 'PENDIENTE' | 'EN_REVISION' | 'ACEPTADA_EN_PROCESO' | 'ADOPCION_COMPLETADA' | 'RECHAZADA';

export interface Postulacion {
  id: number;
  animalId: number;
  animal: string;
  animalFoto: string | null;
  refugio: string;
  postulante: string;
  postulanteEmail: string;
  rut: string;
  telefono: string;
  comuna: string;
  tipoVivienda: string;
  otrasMascotas: string | null;
  motivacion: string;
  motivoRechazo: string | null;
  fecha: string;
  estado: EstadoPostulacion;
  historial: { fecha: string; detalle: string }[];
}

interface PostulacionApi extends Omit<Postulacion, 'fecha' | 'historial'> {
  creadoEn: string;
  historial?: { fecha: string; detalle: string }[];
}

export interface NuevaPostulacion {
  animalId: number;
  rut: string;
  telefono: string;
  comuna: string;
  tipoVivienda: string;
  otrasMascotas?: string;
  motivacion: string;
  aceptaTerminos: boolean;
}

export const ETIQUETA_ESTADO: Record<EstadoPostulacion, { texto: string; color: string }> = {
  PENDIENTE: { texto: 'Pendiente', color: 'warning' },
  EN_REVISION: { texto: 'En revisión', color: 'primary' },
  ACEPTADA_EN_PROCESO: { texto: 'Preseleccionada', color: 'success' },
  ADOPCION_COMPLETADA: { texto: 'Adopción completada', color: 'success' },
  RECHAZADA: { texto: 'Rechazada', color: 'danger' }
};

export const formatearFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });

const aPostulacion = (p: PostulacionApi): Postulacion => ({
  ...p,
  fecha: formatearFecha(p.creadoEn),
  historial: (p.historial ?? []).map((h) => ({ fecha: formatearFecha(h.fecha), detalle: h.detalle })),
});

export const obtenerMisPostulaciones = async () => {
  const { data } = await api.get<{ data: PostulacionApi[] }>('/postulaciones/mias');
  return data.data.map(aPostulacion);
};

export const obtenerPostulacionesRefugio = async (estado?: EstadoPostulacion) => {
  const { data } = await api.get<{ data: PostulacionApi[] }>('/postulaciones', { params: { estado } });
  return data.data.map(aPostulacion);
};

export const obtenerPostulacion = async (id: number) => {
  const { data } = await api.get<{ data: PostulacionApi }>(`/postulaciones/${id}`);
  return aPostulacion(data.data);
};

export const crearPostulacion = async (datos: NuevaPostulacion) => {
  const { data } = await api.post<{ data: PostulacionApi }>('/postulaciones', datos);
  return aPostulacion(data.data);
};

export const cambiarEstadoPostulacion = async (id: number, estado: EstadoPostulacion, motivoRechazo?: string) => {
  const { data } = await api.patch<{ data: PostulacionApi }>(`/postulaciones/${id}/estado`, { estado, motivoRechazo });
  return aPostulacion(data.data);
};

export const retirarPostulacion = async (id: number) => {
  await api.delete(`/postulaciones/${id}`);
};
