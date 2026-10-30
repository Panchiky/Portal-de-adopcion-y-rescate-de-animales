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
  }

  if (status >= 500) {
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
