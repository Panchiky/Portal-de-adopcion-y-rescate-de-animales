const db = require('../config/db');
const HttpError = require('../utils/httpError');

// Cambios de estado permitidos para el refugio
const TRANSICIONES = {
  PENDIENTE: ['EN_REVISION', 'RECHAZADA'],
  EN_REVISION: ['ACEPTADA_EN_PROCESO', 'RECHAZADA'],
  ACEPTADA_EN_PROCESO: ['ADOPCION_COMPLETADA', 'RECHAZADA'],
  ADOPCION_COMPLETADA: [],
  RECHAZADA: [],
};

const DETALLE_POR_ESTADO = {
  EN_REVISION: 'El refugio comenzó la revisión',
  ACEPTADA_EN_PROCESO: 'Postulación preseleccionada',
  ADOPCION_COMPLETADA: 'Adopción completada',
  RECHAZADA: 'Postulación rechazada',
};

const SELECT_POSTULACION = `
  SELECT p.*, a.nombre AS animal, a.foto_url AS animal_foto, a.refugio_id, r.nombre AS refugio,
         u.nombre || ' ' || u.apellido AS postulante, u.email AS postulante_email
  FROM postulaciones p
  JOIN animales a ON a.id = p.animal_id
  JOIN refugios r ON r.id = a.refugio_id
  JOIN usuarios u ON u.id = p.usuario_id`;

function postulacionPublica(fila) {
  return {
    id: fila.id,
    usuarioId: fila.usuario_id,
    postulante: fila.postulante,
    postulanteEmail: fila.postulante_email,
    animalId: fila.animal_id,
    animal: fila.animal,
    animalFoto: fila.animal_foto,
    refugioId: fila.refugio_id,
    refugio: fila.refugio,
    estado: fila.estado,
    rut: fila.rut,
    telefono: fila.telefono,
    comuna: fila.comuna,
    tipoVivienda: fila.tipo_vivienda,
    otrasMascotas: fila.otras_mascotas,
    motivacion: fila.motivacion,
    motivoRechazo: fila.motivo_rechazo,
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

async function buscarPorId(id) {
  const { rows } = await db.query(`${SELECT_POSTULACION} WHERE p.id = $1`, [id]);
  if (rows.length === 0) {
    throw new HttpError(404, 'Postulación no encontrada');
  }
  return postulacionPublica(rows[0]);
}

async function historial(id) {
  const { rows } = await db.query(
    `SELECT estado_anterior, estado_nuevo, detalle, creado_en
     FROM historial_postulaciones WHERE postulacion_id = $1 ORDER BY creado_en, id`,
    [id],
  );
  return rows.map((h) => ({
    estadoAnterior: h.estado_anterior,
    estadoNuevo: h.estado_nuevo,
    detalle: h.detalle,
    fecha: h.creado_en,
  }));
}

async function crear(usuarioId, datos) {
  const animal = await db.query('SELECT id, nombre, estado FROM animales WHERE id = $1', [datos.animalId]);
  if (animal.rowCount === 0) {
    throw new HttpError(404, 'Animal no encontrado');
  }
  if (animal.rows[0].estado !== 'DISPONIBLE') {
    throw new HttpError(409, `${animal.rows[0].nombre} no está disponible para adopción`);
  }

  try {
    const id = await db.transaccion(async (cliente) => {
      const { rows } = await cliente.query(
        `INSERT INTO postulaciones (usuario_id, animal_id, rut, telefono, comuna, tipo_vivienda, otras_mascotas, motivacion, acepta_terminos)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [usuarioId, datos.animalId, datos.rut, datos.telefono, datos.comuna, datos.tipoVivienda,
          datos.otrasMascotas, datos.motivacion, datos.aceptaTerminos],
      );
      await cliente.query(
        `INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, detalle)
         VALUES ($1, NULL, 'PENDIENTE', 'Postulación enviada')`,
        [rows[0].id],
      );
      return rows[0].id;
    });
    return buscarPorId(id);
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, 'Ya tienes una postulación activa para este animal');
    }
    throw err;
  }
}

async function listarDeUsuario(usuarioId) {
  const { rows } = await db.query(`${SELECT_POSTULACION} WHERE p.usuario_id = $1 ORDER BY p.creado_en DESC`, [usuarioId]);
  return rows.map(postulacionPublica);
}

async function listarDeRefugio(refugioId, estado) {
  const valores = [refugioId];
  let filtro = '';
  if (estado) {
    valores.push(estado);
    filtro = 'AND p.estado = $2';
  }
  const { rows } = await db.query(
    `${SELECT_POSTULACION} WHERE a.refugio_id = $1 ${filtro} ORDER BY p.creado_en DESC`,
    valores,
  );
  return rows.map(postulacionPublica);
}

async function obtenerConHistorial(id, usuario) {
  const postulacion = await buscarPorId(id);
  const esDueno = usuario.rol === 'USUARIO' && postulacion.usuarioId === usuario.id;
  const esAdminDelRefugio = usuario.rol === 'ADMIN' && postulacion.refugioId === usuario.refugioId;
  if (!esDueno && !esAdminDelRefugio) {
    throw new HttpError(403, 'No tienes acceso a esta postulación');
  }
  return { ...postulacion, historial: await historial(id) };
}

async function cambiarEstado(id, admin, { estado, motivoRechazo, detalle }) {
  const postulacion = await buscarPorId(id);
  if (postulacion.refugioId !== admin.refugioId) {
    throw new HttpError(403, 'Esta postulación pertenece a otro refugio');
  }
  if (!TRANSICIONES[postulacion.estado].includes(estado)) {
    throw new HttpError(409, `No se puede pasar de ${postulacion.estado} a ${estado}`);
  }

  const texto = estado === 'RECHAZADA'
    ? `Rechazada: ${motivoRechazo}`
    : detalle || DETALLE_POR_ESTADO[estado];

  try {
    await db.transaccion(async (cliente) => {
      await cliente.query(
        'UPDATE postulaciones SET estado = $1, motivo_rechazo = $2 WHERE id = $3',
        [estado, estado === 'RECHAZADA' ? motivoRechazo : null, id],
      );
      await cliente.query(
        `INSERT INTO historial_postulaciones (postulacion_id, estado_anterior, estado_nuevo, admin_id, detalle)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, postulacion.estado, estado, admin.id, texto],
      );

      // El estado del animal acompaña al de la postulación
      if (estado === 'ACEPTADA_EN_PROCESO') {
        await cliente.query("UPDATE animales SET estado = 'RESERVADO' WHERE id = $1", [postulacion.animalId]);
      } else if (estado === 'ADOPCION_COMPLETADA') {
        await cliente.query("UPDATE animales SET estado = 'ADOPTADO' WHERE id = $1", [postulacion.animalId]);
      } else if (estado === 'RECHAZADA' && postulacion.estado === 'ACEPTADA_EN_PROCESO') {
        await cliente.query("UPDATE animales SET estado = 'DISPONIBLE' WHERE id = $1", [postulacion.animalId]);
      }

      await cliente.query(
        `INSERT INTO notificaciones (usuario_id, titulo, mensaje, enlace) VALUES ($1, $2, $3, $4)`,
        [
          postulacion.usuarioId,
          `Tu postulación por ${postulacion.animal} cambió de estado`,
          `${postulacion.refugio}: ${texto}`,
          `/usuario/postulaciones/${id}`,
        ],
      );
    });
  } catch (err) {
    if (err.code === '23505') {
      throw new HttpError(409, `${postulacion.animal} ya tiene otra postulación preseleccionada`);
    }
    throw err;
  }

  return obtenerConHistorial(id, admin);
}

async function retirar(id, usuarioId) {
  const postulacion = await buscarPorId(id);
  if (postulacion.usuarioId !== usuarioId) {
    throw new HttpError(403, 'No tienes acceso a esta postulación');
  }
  if (postulacion.estado !== 'PENDIENTE') {
    throw new HttpError(409, 'Solo puedes retirar una postulación que sigue pendiente');
  }
  await db.query('DELETE FROM postulaciones WHERE id = $1', [id]);
}

module.exports = { crear, listarDeUsuario, listarDeRefugio, obtenerConHistorial, cambiarEstado, retirar };
