const notificacionesService = require('../services/notificaciones.service');
const { idValido } = require('../utils/validaciones');

async function listar(req, res, next) {
  try {
    const notificaciones = await notificacionesService.listar(req.usuario.id);
    res.status(200).json({ ok: true, data: notificaciones });
  } catch (err) {
    next(err);
  }
}

async function marcarLeida(req, res, next) {
  try {
    await notificacionesService.marcarLeida(idValido(req.params.id), req.usuario.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, marcarLeida };
