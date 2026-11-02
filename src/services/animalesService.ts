import { api } from './api';

export type EstadoAnimal = 'BORRADOR' | 'DISPONIBLE' | 'RESERVADO' | 'ADOPTADO' | 'ARCHIVADO';

// Formato que entrega la API
export interface AnimalApi {
  id: number;
  refugioId: number;
  refugio: string;
  comuna: string;
  nombre: string;
  especie: 'PERRO' | 'GATO';
  raza: string | null;
  sexo: 'MACHO' | 'HEMBRA';
  edadMeses: number;
  tamano: 'PEQUENO' | 'MEDIANO' | 'GRANDE';
  estado: EstadoAnimal;
  descripcion: string | null;
  salud: string | null;
  vacunado: boolean;
  esterilizado: boolean;
  fotoUrl: string | null;
}

// Formato que usan las pantallas
export interface Animal {
  id: number;
  name: string;
  species: string;
  gender: string;
  age: string;
  size: string;
  status: EstadoAnimal;
  tags: string[];
  description: string;
  shelter: string;
  location: string;
  distance: string;
  health: string;
  image: string;
  api: AnimalApi;
}

interface RespuestaLista<T> {
  ok: true;
  data: T[];
  meta?: { pagina: number; limite: number; total: number };
}

interface RespuestaItem<T> {
  ok: true;
  data: T;
}

const FOTO_POR_ESPECIE = {
  PERRO: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  GATO: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

export const TEXTO_TAMANO = { PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' };

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

export const textoEdad = (meses: number) => {
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
};

export const aAnimal = (a: AnimalApi): Animal => ({
  id: a.id,
  name: a.nombre,
  species: [capitalizar(a.especie), a.raza?.toLowerCase()].filter(Boolean).join(' '),
  gender: capitalizar(a.sexo),
  age: textoEdad(a.edadMeses),
  size: TEXTO_TAMANO[a.tamano],
  status: a.estado,
  tags: [a.vacunado && 'Vacunado', a.esterilizado && 'Esterilizado', TEXTO_TAMANO[a.tamano]].filter(Boolean) as string[],
  description: a.descripcion ?? '',
  shelter: a.refugio,
  location: a.comuna,
  distance: '',
  health: a.salud ? `Salud: ${a.salud}` : '',
  image: a.fotoUrl || FOTO_POR_ESPECIE[a.especie],
  api: a,
});

// Une refugio, comuna y distancia omitiendo los datos vacíos
export const ubicacionAnimal = (a: Animal) => [a.shelter, a.location, a.distance].filter(Boolean).join(' • ');

export const obtenerAnimales = async () => {
  const { data } = await api.get<RespuestaLista<AnimalApi>>('/animales', { params: { limite: 50 } });
  return data.data.map(aAnimal);
};

export const obtenerAnimal = async (id: number) => {
  const { data } = await api.get<RespuestaItem<AnimalApi>>(`/animales/${id}`);
  return aAnimal(data.data);
};

export const obtenerAnimalesRefugio = async (estado?: EstadoAnimal) => {
  const { data } = await api.get<RespuestaLista<AnimalApi>>('/animales/gestion', { params: { limite: 50, estado } });
  return data.data.map(aAnimal);
};

export const obtenerFavoritos = async () => {
  const { data } = await api.get<RespuestaLista<AnimalApi>>('/favoritos');
  return data.data.map(aAnimal);
};

export const agregarFavorito = async (id: number) => {
  await api.post(`/favoritos/${id}`);
};

export const quitarFavorito = async (id: number) => {
  await api.delete(`/favoritos/${id}`);
};

// Datos que envía el formulario de ficha del refugio
export type DatosAnimal = Pick<AnimalApi, 'nombre' | 'especie' | 'raza' | 'sexo' | 'edadMeses' | 'tamano' | 'estado' | 'descripcion' | 'salud' | 'vacunado' | 'esterilizado' | 'fotoUrl'>;

export const crearAnimal = async (datos: DatosAnimal) => {
  const { data } = await api.post<RespuestaItem<AnimalApi>>('/animales', datos);
  return aAnimal(data.data);
};

export const actualizarAnimal = async (id: number, datos: DatosAnimal) => {
  const { data } = await api.put<RespuestaItem<AnimalApi>>(`/animales/${id}`, datos);
  return aAnimal(data.data);
};

export const cambiarEstadoAnimal = async (id: number, estado: EstadoAnimal) => {
  const { data } = await api.patch<RespuestaItem<AnimalApi>>(`/animales/${id}/estado`, { estado });
  return aAnimal(data.data);
};

export const eliminarAnimal = async (id: number) => {
  await api.delete(`/animales/${id}`);
};
