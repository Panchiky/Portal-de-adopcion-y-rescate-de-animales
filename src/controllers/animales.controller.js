const animalesService = require('../services/animales.service');
const HttpError = require('../utils/httpError');
const {
  ESPECIES, SEXOS, TAMANOS, ESTADOS_ANIMAL,
  idValido, paginacion, validarAnimal, validarEstadoAnimal, exigir,
} = require('../utils/validaciones');

function leerFiltros(query) {
  const filtros = {};
  const especie = String(query.especie || '').toUpperCase();
  const tamano = String(query.tamano || '').toUpperCase();
  const sexo = String(query.sexo || '').toUpperCase();
  const estado = String(query.estado || '').toUpperCase();

  if (especie && ESPECIES.includes(especie)) filtros.especie = especie;
  if (tamano && TAMANOS.includes(tamano)) filtros.tamano = tamano;
  if (sexo && SEXOS.includes(sexo)) filtros.sexo = sexo;
  if (estado && ESTADOS_ANIMAL.includes(estado)) filtros.estado = estado;
  if (typeof query.comuna === 'string' && query.comuna.trim()) filtros.comuna = query.comuna.trim().slice(0, 80);
  if (typeof query.q === 'string' && query.q.trim()) filtros.q = query.q.trim().slice(0, 60);
  return filtros;
}

function refugioDelAdmin(req) {
  if (!req.usuario.refugioId) {
    throw new HttpError(403, 'Tu cuenta de administrador no está asociada a un refugio');
  }
  return req.usuario.refugioId;
}

async function listar(req, res, next) {
  try {
    const { items, meta } = await animalesService.listarDisponibles(leerFiltros(req.query), paginacion(req.query));
    res.status(200).json({ ok: true, data: items, meta });
  } catch (err) {
    next(err);
  }
}

async function listarGestion(req, res, next) {
  try {
    const { items, meta } = await animalesService.listarDeRefugio(refugioDelAdmin(req), leerFiltros(req.query), paginacion(req.query));
    res.status(200).json({ ok: true, data: items, meta });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const animal = await animalesService.obtenerVisible(idValido(req.params.id), req.usuario);
    res.status(200).json({ ok: true, data: animal });
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const datos = exigir(validarAnimal(req.body), 'Datos del animal no válidos');
    const animal = await animalesService.crear(refugioDelAdmin(req), datos);
    res.status(201).location(`/api/animales/${animal.id}`).json({ ok: true, data: animal });
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const id = idValido(req.params.id);
    const datos = exigir(validarAnimal(req.body), 'Datos del animal no válidos');
    const animal = await animalesService.actualizar(id, refugioDelAdmin(req), datos);
    res.status(200).json({ ok: true, data: animal });
  } catch (err) {
    next(err);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    const id = idValido(req.params.id);
    const { estado } = exigir(validarEstadoAnimal(req.body), 'Estado no válido');
    const animal = await animalesService.cambiarEstado(id, refugioDelAdmin(req), estado);
    res.status(200).json({ ok: true, data: animal });
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    await animalesService.eliminar(idValido(req.params.id), refugioDelAdmin(req));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, listarGestion, obtener, crear, actualizar, cambiarEstado, eliminar };
