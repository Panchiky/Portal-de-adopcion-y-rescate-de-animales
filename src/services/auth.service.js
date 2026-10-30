const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { jwt: jwtConfig } = require('../config/env');
const HttpError = require('../utils/httpError');

const SALT_ROUNDS = 10;
// Hash de relleno para que el login tarde lo mismo exista o no el correo
const HASH_FALSO = '$2a$10$DlZfwopkrc2GoIHcrs2nKe57X35qli9VEqp6sLwPu1fZSkSPAlDIe';

function usuarioPublico(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    apellido: fila.apellido,
    email: fila.email,
    rol: fila.rol,
    refugioId: fila.refugio_id,
    telefono: fila.telefono,
    comuna: fila.comuna,
  };
}

function generarToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, rol: usuario.rol, refugioId: usuario.refugioId },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );
}

async function registrar({ nombre, apellido, email, password, telefono, comuna }) {
  const existe = await db.query('SELECT 1 FROM usuarios WHERE LOWER(email) = $1', [email]);
  if (existe.rowCount > 0) {
    throw new HttpError(409, 'Ya existe una cuenta con ese correo');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await db.query(
    `INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id, telefono, comuna)
     VALUES ($1, $2, $3, $4, (SELECT id FROM roles WHERE nombre = 'USUARIO'), $5, $6)
     RETURNING id, nombre, apellido, email, refugio_id, telefono, comuna, 'USUARIO' AS rol`,
    [nombre, apellido, email, passwordHash, telefono, comuna],
  );

  const usuario = usuarioPublico(rows[0]);
  return { token: generarToken(usuario), usuario };
}

async function login({ email, password }) {
  const { rows } = await db.query(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.password_hash, u.refugio_id, u.telefono, u.comuna, r.nombre AS rol
     FROM usuarios u
     JOIN roles r ON r.id = u.rol_id
     WHERE LOWER(u.email) = $1`,
    [email],
  );

  const fila = rows[0];
  const coincide = await bcrypt.compare(password, fila ? fila.password_hash : HASH_FALSO);
  if (!fila || !coincide) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }

  const usuario = usuarioPublico(fila);
  return { token: generarToken(usuario), usuario };
}

async function obtenerPerfil(id) {
  const { rows } = await db.query(
    `SELECT u.id, u.nombre, u.apellido, u.email, u.refugio_id, u.telefono, u.comuna, r.nombre AS rol
     FROM usuarios u
     JOIN roles r ON r.id = u.rol_id
     WHERE u.id = $1`,
    [id],
  );
  if (rows.length === 0) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return usuarioPublico(rows[0]);
}

module.exports = { registrar, login, obtenerPerfil };
