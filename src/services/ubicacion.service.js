// Integración con un servicio externo: geocodificación de la dirección de un refugio
// usando la API pública de OpenStreetMap (Nominatim). Convierte "Av. Brasil 1234, Valparaíso"
// en coordenadas (latitud y longitud) para mostrar el mapa del refugio en la ficha del animal.
const db = require('../config/db');
const { geocodificacion } = require('../config/env');
const HttpError = require('../utils/httpError');

// Caché en memoria: la dirección de un refugio casi nunca cambia y Nominatim pide
// no hacer más de una consulta por segundo, así que se consulta una sola vez por refugio
const cache = new Map();
const DURACION_CACHE_MS = 24 * 60 * 60 * 1000;

async function buscarEnNominatim(texto) {
  const url = new URL('/search', geocodificacion.url);
  url.searchParams.set('q', texto);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'cl');

  const respuesta = await fetch(url, {
    // Nominatim exige identificar la aplicación que hace la consulta
    headers: { 'User-Agent': geocodificacion.userAgent, 'Accept-Language': 'es' },
    // Si el servicio externo no responde, no se deja esperando al usuario
    signal: AbortSignal.timeout(geocodificacion.timeoutMs),
  });
  if (!respuesta.ok) {
    throw new Error(`Nominatim respondió ${respuesta.status}`);
  }
  const resultados = await respuesta.json();
  return Array.isArray(resultados) && resultados.length > 0 ? resultados[0] : null;
}

async function obtenerUbicacionRefugio(refugioId) {
  const { rows } = await db.query(
    'SELECT id, nombre, direccion, comuna, region FROM refugios WHERE id = $1',
    [refugioId],
  );
  if (rows.length === 0) {
    throw new HttpError(404, 'Refugio no encontrado');
  }
  const refugio = rows[0];

  const guardado = cache.get(refugio.id);
  if (guardado && Date.now() - guardado.creadoEn < DURACION_CACHE_MS) {
    return { ...guardado.datos, cache: true };
  }

  // Primero se busca la dirección exacta; si no aparece, se usa el centro de la comuna
  const consultas = [
    refugio.direccion && `${refugio.direccion}, ${refugio.comuna}, ${refugio.region}, Chile`,
    `${refugio.comuna}, ${refugio.region}, Chile`,
  ].filter(Boolean);

  let resultado = null;
  let precision = 'direccion';
  try {
    for (let i = 0; i < consultas.length && !resultado; i += 1) {
      resultado = await buscarEnNominatim(consultas[i]);
      if (resultado && i > 0) precision = 'comuna';
    }
  } catch (err) {
    console.error('Error al consultar OpenStreetMap:', err.message);
    // 502: la API funciona, pero el servicio externo del que depende falló o no respondió
    throw new HttpError(502, 'El servicio de mapas no está disponible en este momento');
  }

  if (!resultado) {
    throw new HttpError(404, 'No se encontró la ubicación del refugio en el mapa');
  }

  const datos = {
    refugioId: refugio.id,
    refugio: refugio.nombre,
    direccion: [refugio.direccion, refugio.comuna, refugio.region].filter(Boolean).join(', '),
    latitud: Number(resultado.lat),
    longitud: Number(resultado.lon),
    precision,
    fuente: 'OpenStreetMap (Nominatim)',
  };
  cache.set(refugio.id, { datos, creadoEn: Date.now() });
  return { ...datos, cache: false };
}

module.exports = { obtenerUbicacionRefugio };
