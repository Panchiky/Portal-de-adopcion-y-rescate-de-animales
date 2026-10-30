export type EstadoPostulacion = 'PENDIENTE' | 'EN_REVISION' | 'ACEPTADA_EN_PROCESO' | 'ADOPCION_COMPLETADA' | 'RECHAZADA';

export interface Postulacion {
  id: number;
  animalId: number;
  animal: string;
  refugio: string;
  postulante: string;
  rut: string;
  fecha: string;
  estado: EstadoPostulacion;
  motivacion: string;
  historial: { fecha: string; detalle: string }[];
}

export const ETIQUETA_ESTADO: Record<EstadoPostulacion, { texto: string; color: string }> = {
  PENDIENTE: { texto: 'Pendiente', color: 'warning' },
  EN_REVISION: { texto: 'En revisión', color: 'primary' },
  ACEPTADA_EN_PROCESO: { texto: 'Preseleccionada', color: 'success' },
  ADOPCION_COMPLETADA: { texto: 'Adopción completada', color: 'success' },
  RECHAZADA: { texto: 'Rechazada', color: 'danger' }
};

const POSTULACIONES: Postulacion[] = [
  {
    id: 1,
    animalId: 1,
    animal: 'Milo',
    refugio: 'Huellas Felices',
    postulante: 'Tomás Guerra',
    rut: 'RUT •• 285.432-1',
    fecha: '14 sep',
    estado: 'PENDIENTE',
    motivacion: 'Vivo en departamento con balcón protegido y trabajo de forma híbrida.',
    historial: [{ fecha: '14 sep', detalle: 'Postulación enviada' }]
  },
  {
    id: 2,
    animalId: 2,
    animal: 'Luna',
    refugio: 'Refugio Patitas',
    postulante: 'Camila Morales',
    rut: 'RUT •• 456.789-0',
    fecha: '13 sep',
    estado: 'EN_REVISION',
    motivacion: 'Tengo experiencia con gatos y una casa con patio cerrado.',
    historial: [
      { fecha: '13 sep', detalle: 'Postulación enviada' },
      { fecha: '15 sep', detalle: 'El refugio comenzó la revisión' }
    ]
  },
  {
    id: 3,
    animalId: 3,
    animal: 'Rocky',
    refugio: 'Amigos Peludos',
    postulante: 'Javier Pérez',
    rut: 'RUT •• 345.678-9',
    fecha: '12 sep',
    estado: 'ACEPTADA_EN_PROCESO',
    motivacion: 'Salgo a correr todos los días y busco un compañero activo.',
    historial: [
      { fecha: '12 sep', detalle: 'Postulación enviada' },
      { fecha: '13 sep', detalle: 'El refugio comenzó la revisión' },
      { fecha: '16 sep', detalle: 'Postulación preseleccionada, entrevista el jueves 17 a las 11:00' }
    ]
  },
  {
    id: 4,
    animalId: 1,
    animal: 'Milo',
    refugio: 'Huellas Felices',
    postulante: 'Ana Vera',
    rut: 'RUT •• 234.567-8',
    fecha: '11 sep',
    estado: 'RECHAZADA',
    motivacion: 'Quiero un gato para acompañar a mi familia.',
    historial: [
      { fecha: '11 sep', detalle: 'Postulación enviada' },
      { fecha: '12 sep', detalle: 'Rechazada: el hogar no permite mascotas según contrato de arriendo' }
    ]
  }
];

export const obtenerPostulaciones = () => POSTULACIONES;

export const obtenerPostulacion = (id: number) => POSTULACIONES.find((p) => p.id === id);
