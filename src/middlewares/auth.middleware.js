const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const HttpError = require('../utils/httpError');

function leerToken(req) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  return tipo === 'Bearer' && token ? token : null;
}

function verificarToken(req, res, next) {
  const token = leerToken(req);
  if (!token) {
    return next(new HttpError(401, 'Debes iniciar sesión para acceder a este recurso'));
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.usuario = { id: payload.sub, rol: payload.rol, refugioId: payload.refugioId };
    return next();
  } catch (err) {
    const mensaje = err.name === 'TokenExpiredError'
      ? 'La sesión expiró, vuelve a iniciar sesión'
      : 'Token no válido';
    return next(new HttpError(401, mensaje));
  }
}

// Para rutas públicas que muestran más información si hay sesión (no falla sin token)
function tokenOpcional(req, res, next) {
  const token = leerToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, jwtConfig.secret);
      req.usuario = { id: payload.sub, rol: payload.rol, refugioId: payload.refugioId };
    } catch (err) {
      req.usuario = undefined;
    }
  }
  next();
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
