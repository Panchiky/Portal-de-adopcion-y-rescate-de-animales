const healthService = require('../services/health.service');

async function obtenerEstado(req, res, next) {
  try {
    const bd = await healthService.estadoBaseDatos();
    res.status(200).json({
      ok: true,
      data: { servidor: 'activo', baseDatos: bd.base, hora: bd.hora },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { obtenerEstado };
