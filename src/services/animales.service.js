const db = require('../config/db');
const HttpError = require('../utils/httpError');

const SELECT_ANIMAL = `
  SELECT a.*, r.nombre AS refugio, r.comuna AS comuna
  FROM animales a
  JOIN refugios r ON r.id = a.refugio_id`;

function animalPublico(fila) {
  return {
    id: fila.id,
    refugioId: fila.refugio_id,
    refugio: fila.refugio,
    comuna: fila.comuna,
    nombre: fila.nombre,
    especie: fila.especie,
    raza: fila.raza,
    sexo: fila.sexo,
    edadMeses: fila.edad_meses,
    tamano: fila.tamano,
    estado: fila.estado,
    descripcion: fila.descripcion,
    salud: fila.salud,
    vacunado: fila.vacunado,
    esterilizado: fila.esterilizado,
    fotoUrl: fila.foto_url,
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

// Arma el WHERE con parámetros numerados ($1, $2...) para evitar inyección SQL
function construirFiltros(filtros, condicionesBase = [], valoresBase = []) {
  const condiciones = [...condicionesBase];
  const valores = [...valoresBase];
  const agregar = (sql, valor) => {
    valores.push(valor);
    condiciones.push(sql.replace('?', `$${valores.length}`));
  };

  if (filtros.especie) agregar('a.especie = ?', filtros.especie);
  if (filtros.tamano) agregar('a.tamano = ?', filtros.tamano);
  if (filtros.sexo) agregar('a.sexo = ?', filtros.sexo);
  if (filtros.estado) agregar('a.estado = ?', filtros.estado);
  if (filtros.comuna) agregar('r.comuna ILIKE ?', `%${filtros.comuna}%`);
  if (filtros.q) agregar('a.nombre ILIKE ?', `%${filtros.q}%`);

  return { where: condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '', valores };
}

async function listar(filtros, { limite, offset, pagina }, condicionesBase, valoresBase) {
  const { where, valores } = construirFiltros(filtros, condicionesBase, valoresBase);
  const total = await db.query(
    `SELECT COUNT(*)::int AS total FROM animales a JOIN refugios r ON r.id = a.refugio_id ${where}`,
    valores,
  );
  const { rows } = await db.query(
    `${SELECT_ANIMAL} ${where} ORDER BY a.creado_en DESC, a.id DESC LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`,
    [...valores, limite, offset],
  );
  return {
    items: rows.map(animalPublico),
    meta: { pagina, limite, total: total.rows[0].total },
  };
}

function listarDisponibles(filtros, paginas) {
  return listar({ ...filtros, estado: undefined }, paginas, ["a.estado = 'DISPONIBLE'"], []);
}

function listarDeRefugio(refugioId, filtros, paginas) {
  return listar(filtros, paginas, ['a.refugio_id = $1'], [refugioId]);
}

async function buscarPorId(id) {
  const { rows } = await db.query(`${SELECT_ANIMAL} WHERE a.id = $1`, [id]);
  if (rows.length === 0) {
    throw new HttpError(404, 'Animal no encontrado');
  }
  return animalPublico(rows[0]);
}

async function obtenerVisible(id, usuario) {
  const animal = await buscarPorId(id);
  const esAdminDelRefugio = usuario && usuario.rol === 'ADMIN' && usuario.refugioId === animal.refugioId;
  if (['BORRADOR', 'ARCHIVADO'].includes(animal.estado) && !esAdminDelRefugio) {
    throw new HttpError(404, 'Animal no encontrado');
  }
  return animal;
}

async function obtenerPropio(id, refugioId) {
  const animal = await buscarPorId(id);
  if (animal.refugioId !== refugioId) {
    throw new HttpError(403, 'Este animal pertenece a otro refugio');
  }
  return animal;
}

async function crear(refugioId, datos) {
  const { rows } = await db.query(
    `INSERT INTO animales (refugio_id, nombre, especie, raza, sexo, edad_meses, tamano, estado, descripcion, salud, vacunado, esterilizado, foto_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id`,
    [refugioId, datos.nombre, datos.especie, datos.raza, datos.sexo, datos.edadMeses, datos.tamano,
      datos.estado, datos.descripcion, datos.salud, datos.vacunado, datos.esterilizado, datos.fotoUrl],
  );
  return buscarPorId(rows[0].id);
}

async function actualizar(id, refugioId, datos) {
  await obtenerPropio(id, refugioId);
  await db.query(
    `UPDATE animales
     SET nombre = $1, especie = $2, raza = $3, sexo = $4, edad_meses = $5, tamano = $6, estado = $7,
         descripcion = $8, salud = $9, vacunado = $10, esterilizado = $11, foto_url = $12
     WHERE id = $13`,
    [datos.nombre, datos.especie, datos.raza, datos.sexo, datos.edadMeses, datos.tamano, datos.estado,
      datos.descripcion, datos.salud, datos.vacunado, datos.esterilizado, datos.fotoUrl, id],
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, refugioId, estado) {
  await obtenerPropio(id, refugioId);
  await db.query('UPDATE animales SET estado = $1 WHERE id = $2', [estado, id]);
  return buscarPorId(id);
}

async function eliminar(id, refugioId) {
  await obtenerPropio(id, refugioId);
  const postulaciones = await db.query('SELECT 1 FROM postulaciones WHERE animal_id = $1 LIMIT 1', [id]);
  if (postulaciones.rowCount > 0) {
    throw new HttpError(409, 'El animal tiene postulaciones asociadas; cámbialo a ARCHIVADO en vez de eliminarlo');
  }
  await db.query('DELETE FROM animales WHERE id = $1', [id]);
}

module.exports = {
  animalPublico,
  listarDisponibles,
  listarDeRefugio,
  obtenerVisible,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
};
