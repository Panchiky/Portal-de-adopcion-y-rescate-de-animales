function rutaNoEncontrada(req, res) {
  res.status(404).json({ ok: false, error: { mensaje: `Ruta ${req.method} ${req.originalUrl} no encontrada` } });
}

// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    ok: false,
    error: { mensaje: status >= 500 ? 'Error interno del servidor' : err.message },
  });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
