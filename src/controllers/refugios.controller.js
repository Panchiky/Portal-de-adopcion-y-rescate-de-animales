const ubicacionService = require('../services/ubicacion.service');
const { idValido } = require('../utils/validaciones');

// GET /refugios/:id/ubicacion: coordenadas del refugio obtenidas desde OpenStreetMap
async function ubicacion(req, res, next) {
  try {
    const datos = await ubicacionService.obtenerUbicacionRefugio(idValido(req.params.id));
    res.status(200).json({ ok: true, data: datos });
  } catch (err) {
    next(err);
  }
}

module.exports = { ubicacion };
