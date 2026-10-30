const db = require('../config/db');
const HttpError = require('../utils/httpError');

async function listar(usuarioId) {
  const { rows } = await db.query(
    `SELECT id, titulo, mensaje, enlace, leida, creado_en
     FROM notificaciones WHERE usuario_id = $1 ORDER BY creado_en DESC, id DESC`,
    [usuarioId],
  );
  return rows.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    mensaje: n.mensaje,
    enlace: n.enlace,
    leida: n.leida,
    fecha: n.creado_en,
  }));
}

async function marcarLeida(id, usuarioId) {
  const { rowCount } = await db.query(
    'UPDATE notificaciones SET leida = TRUE WHERE id = $1 AND usuario_id = $2',
    [id, usuarioId],
  );
  if (rowCount === 0) {
    throw new HttpError(404, 'Notificación no encontrada');
  }
}

module.exports = { listar, marcarLeida };
