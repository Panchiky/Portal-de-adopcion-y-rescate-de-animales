const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const db = require('../config/db');
const HttpError = require('../utils/httpError');

function leerToken(req) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  return tipo === 'Bearer' && token ? token : null;
}

// Verifica la firma y la expiración del token, aceptando solo el algoritmo HS256
function decodificar(token) {
  return jwt.verify(token, jwtConfig.secret, { algorithms: [jwtConfig.algoritmo] });
}

// El rol y el refugio se leen desde la base y no desde el token: si un usuario se elimina
// o se le cambia el rol, su token antiguo deja de servir de inmediato y no recién cuando vence
async function usuarioActual(id) {
  const { rows } = await db.query(
    `SELECT u.id, u.refugio_id, r.nombre AS rol
     FROM usuarios u
     JOIN roles r ON r.id = u.rol_id
     WHERE u.id = $1`,
    [id],
  );
  if (rows.length === 0) {
    return null;
  }
  return { id: rows[0].id, rol: rows[0].rol, refugioId: rows[0].refugio_id };
}

async function verificarToken(req, res, next) {
  const token = leerToken(req);
  if (!token) {
    return next(new HttpError(401, 'Debes iniciar sesión para acceder a este recurso'));
  }

  let payload;
  try {
    payload = decodificar(token);
  } catch (err) {
    const mensaje = err.name === 'TokenExpiredError'
      ? 'La sesión expiró, vuelve a iniciar sesión'
      : 'Token no válido';
    return next(new HttpError(401, mensaje));
  }

  try {
    const usuario = await usuarioActual(payload.sub);
    if (!usuario) {
      return next(new HttpError(401, 'La cuenta ya no existe, vuelve a iniciar sesión'));
    }
    req.usuario = usuario;
    return next();
  } catch (err) {
    return next(err);
  }
}

// Para rutas públicas que muestran más información si hay sesión (no falla sin token)
async function tokenOpcional(req, res, next) {
  const token = leerToken(req);
  req.usuario = undefined;
  if (!token) {
    return next();
  }
  try {
    const payload = decodificar(token);
    req.usuario = (await usuarioActual(payload.sub)) || undefined;
  } catch (err) {
    if (err.name !== 'TokenExpiredError' && err.name !== 'JsonWebTokenError') {
      return next(err);
    }
  }
  return next();
}

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return next(new HttpError(403, 'No tienes permisos para realizar esta acción'));
    }
    return next();
  };
}

module.exports = { verificarToken, tokenOpcional, permitirRoles };
