const postulacionesService = require('../services/postulaciones.service');
const HttpError = require('../utils/httpError');
const {
  ESTADOS_POSTULACION, idValido, validarPostulacion, validarEstadoPostulacion, exigir,
} = require('../utils/validaciones');

async function crear(req, res, next) {
  try {
    const datos = exigir(validarPostulacion(req.body), 'Datos de la postulación no válidos');
    const postulacion = await postulacionesService.crear(req.usuario.id, datos);
    res.status(201).location(`/api/postulaciones/${postulacion.id}`).json({ ok: true, data: postulacion });
  } catch (err) {
    next(err);
  }
}

async function listarMias(req, res, next) {
  try {
    const postulaciones = await postulacionesService.listarDeUsuario(req.usuario.id);
    res.status(200).json({ ok: true, data: postulaciones });
  } catch (err) {
    next(err);
  }
}

async function listarRefugio(req, res, next) {
  try {
    if (!req.usuario.refugioId) {
      throw new HttpError(403, 'Tu cuenta de administrador no está asociada a un refugio');
    }
    const estado = String(req.query.estado || '').toUpperCase();
    const postulaciones = await postulacionesService.listarDeRefugio(
      req.usuario.refugioId,
      ESTADOS_POSTULACION.includes(estado) ? estado : null,
    );
    res.status(200).json({ ok: true, data: postulaciones });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const postulacion = await postulacionesService.obtenerConHistorial(idValido(req.params.id), req.usuario);
    res.status(200).json({ ok: true, data: postulacion });
  } catch (err) {
    next(err);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    const id = idValido(req.params.id);
    const datos = exigir(validarEstadoPostulacion(req.body), 'Cambio de estado no válido');
    const postulacion = await postulacionesService.cambiarEstado(id, req.usuario, datos);
    res.status(200).json({ ok: true, data: postulacion });
  } catch (err) {
    next(err);
  }
}

async function retirar(req, res, next) {
  try {
    await postulacionesService.retirar(idValido(req.params.id), req.usuario.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listarMias, listarRefugio, obtener, cambiarEstado, retirar };
