const animalesService = require('../services/animales.service');
const HttpError = require('../utils/httpError');
const {
  ESPECIES, SEXOS, TAMANOS, ESTADOS_ANIMAL,
  idValido, paginacion, filtroEnum, filtroTexto,
  validarAnimal, validarAnimalParcial, validarEstadoAnimal, exigir,
} = require('../utils/validaciones');

// Lee los filtros de la URL. Un valor no permitido responde 400 con el detalle por campo,
// en vez de ignorarse en silencio y devolver todo el catálogo
function leerFiltros(query, { conEstado }) {
  const errores = [];
  const filtros = {
    especie: filtroEnum(query, 'especie', ESPECIES, errores),
    tamano: filtroEnum(query, 'tamano', TAMANOS, errores),
    sexo: filtroEnum(query, 'sexo', SEXOS, errores),
    comuna: filtroTexto(query, 'comuna', 80, errores),
    q: filtroTexto(query, 'q', 60, errores),
  };
  // El catálogo público solo muestra animales DISPONIBLE, así que ahí no se acepta ?estado
  if (conEstado) {
    filtros.estado = filtroEnum(query, 'estado', ESTADOS_ANIMAL, errores);
  } else if (query.estado !== undefined) {
    errores.push({ campo: 'estado', mensaje: 'El catálogo público solo muestra animales DISPONIBLE' });
  }
  if (errores.length > 0) {
    throw new HttpError(400, 'Filtros de búsqueda no válidos', errores);
  }
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
    const { items, meta } = await animalesService.listarDisponibles(leerFiltros(req.query, { conEstado: false }), paginacion(req.query));
    res.status(200).json({ ok: true, data: items, meta });
  } catch (err) {
    next(err);
  }
}

async function listarGestion(req, res, next) {
  try {
    const { items, meta } = await animalesService.listarDeRefugio(refugioDelAdmin(req), leerFiltros(req.query, { conEstado: true }), paginacion(req.query));
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

// PATCH /animales/:id: actualización parcial, solo con los campos enviados
async function actualizarParcial(req, res, next) {
  try {
    const id = idValido(req.params.id);
    const refugioId = refugioDelAdmin(req);
    const actual = await animalesService.obtenerPropio(id, refugioId);
    const datos = exigir(validarAnimalParcial(req.body, actual), 'Datos del animal no válidos');
    const animal = await animalesService.actualizar(id, refugioId, datos);
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

module.exports = { listar, listarGestion, obtener, crear, actualizar, actualizarParcial, cambiarEstado, eliminar };
