const healthService = require('../services/health.service');

// Informa por separado el estado del servidor y el de la base de datos
async function obtenerEstado(req, res) {
  try {
    const bd = await healthService.estadoBaseDatos();
    res.status(200).json({
      ok: true,
      data: { servidor: 'activo', baseDatos: bd.base, hora: bd.hora },
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      data: { servidor: 'activo', baseDatos: 'no disponible' },
      error: { mensaje: 'La API está encendida, pero no puede conectarse a PostgreSQL' },
    });
  }
}

module.exports = { obtenerEstado };
