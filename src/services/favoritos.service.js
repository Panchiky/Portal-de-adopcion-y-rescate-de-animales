const db = require('../config/db');
const HttpError = require('../utils/httpError');
const { animalPublico } = require('./animales.service');

async function listar(usuarioId) {
  const { rows } = await db.query(
    `SELECT a.*, r.nombre AS refugio, r.comuna AS comuna
     FROM favoritos f
     JOIN animales a ON a.id = f.animal_id
     JOIN refugios r ON r.id = a.refugio_id
     WHERE f.usuario_id = $1 AND a.estado NOT IN ('BORRADOR', 'ARCHIVADO')
     ORDER BY f.creado_en DESC`,
    [usuarioId],
  );
  return rows.map(animalPublico);
}

async function agregar(usuarioId, animalId) {
  const animal = await db.query(
    "SELECT 1 FROM animales WHERE id = $1 AND estado NOT IN ('BORRADOR', 'ARCHIVADO')",
    [animalId],
  );
  if (animal.rowCount === 0) {
    throw new HttpError(404, 'Animal no encontrado');
  }
  const { rowCount } = await db.query(
    'INSERT INTO favoritos (usuario_id, animal_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [usuarioId, animalId],
  );
  return rowCount === 1;
}

async function quitar(usuarioId, animalId) {
  const { rowCount } = await db.query(
    'DELETE FROM favoritos WHERE usuario_id = $1 AND animal_id = $2',
    [usuarioId, animalId],
  );
  if (rowCount === 0) {
    throw new HttpError(404, 'Ese animal no está en tus favoritos');
  }
}

module.exports = { listar, agregar, quitar };
