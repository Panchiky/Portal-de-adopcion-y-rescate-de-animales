const favoritosService = require('../services/favoritos.service');
const { idValido } = require('../utils/validaciones');

async function listar(req, res, next) {
  try {
    const animales = await favoritosService.listar(req.usuario.id);
    res.status(200).json({ ok: true, data: animales });
  } catch (err) {
    next(err);
  }
}

async function agregar(req, res, next) {
  try {
    const animalId = idValido(req.params.animalId, 'animalId');
    const creado = await favoritosService.agregar(req.usuario.id, animalId);
    res.status(creado ? 201 : 200).json({ ok: true, data: { animalId, favorito: true } });
  } catch (err) {
    next(err);
  }
}

async function quitar(req, res, next) {
  try {
    await favoritosService.quitar(req.usuario.id, idValido(req.params.animalId, 'animalId'));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, agregar, quitar };
