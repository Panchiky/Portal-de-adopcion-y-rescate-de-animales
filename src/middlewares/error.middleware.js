const HttpError = require('../utils/httpError');

// Errores que indican que PostgreSQL no está disponible (apagado, reiniciándose o inalcanzable)
const ERRORES_CONEXION_BD = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN', '57P01', '57P03', '08001', '08006'];

function esErrorDeConexionBD(err) {
  return ERRORES_CONEXION_BD.includes(err.code)
    || /Connection terminated|connect ECONNREFUSED/i.test(err.message || '');
}

function rutaNoEncontrada(req, res) {
  res.status(404).json({ ok: false, error: { mensaje: `Ruta ${req.method} ${req.originalUrl} no encontrada` } });
}

// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  let status = err.status || 500;
  let mensaje = err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  } else if (err.code === '23505') {
    status = 409;
    mensaje = 'El registro ya existe';
  } else if (err.code === '23503' || err.code === '23514') {
    status = 400;
    mensaje = 'Los datos no cumplen las reglas de la base de datos';
  } else if (esErrorDeConexionBD(err)) {
    // 503 = el servidor funciona, pero un servicio del que depende (la base de datos) no responde
    console.error(`Base de datos no disponible (${err.code || err.message})`);
    return res.status(503).json({
      ok: false,
      error: { mensaje: 'La base de datos no está disponible en este momento. Intenta de nuevo en unos segundos' },
    });
  }

  // Un 5xx inesperado (bug) no muestra detalles internos; un HttpError 5xx creado a propósito
  // (por ejemplo 502 cuando falla el servicio externo de mapas) sí conserva su mensaje
  if (status >= 500 && !(err instanceof HttpError)) {
    console.error(err);
    mensaje = 'Error interno del servidor';
  }

  const error = { mensaje };
  if (err.detalles) {
    error.detalles = err.detalles;
  }
  res.status(status).json({ ok: false, error });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
