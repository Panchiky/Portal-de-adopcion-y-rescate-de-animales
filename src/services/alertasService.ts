export interface Alerta {
  id: number;
  titulo: string;
  detalle: string;
  fecha: string;
  leida: boolean;
  ruta?: string;
}

const ALERTAS: Alerta[] = [
  {
    id: 1,
    titulo: 'Postulación preseleccionada',
    detalle: 'Amigos Peludos preseleccionó tu postulación por Rocky. Revisa la entrevista propuesta.',
    fecha: 'Hace 2 horas',
    leida: false,
    ruta: '/usuario/postulaciones/3'
  },
  {
    id: 2,
    titulo: 'Postulación en revisión',
    detalle: 'Refugio Patitas comenzó a revisar tu postulación por Luna.',
    fecha: 'Ayer',
    leida: false,
    ruta: '/usuario/postulaciones/2'
  },
  {
    id: 3,
    titulo: 'Bienvenido a PatitasGo',
    detalle: 'Explora animales disponibles cerca de ti y guarda tus favoritos.',
    fecha: '10 sep',
    leida: true
  }
];

export const obtenerAlertas = () => ALERTAS;
