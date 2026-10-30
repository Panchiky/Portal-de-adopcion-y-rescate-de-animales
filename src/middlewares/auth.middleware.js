const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const HttpError = require('../utils/httpError');

function verificarToken(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
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

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return next(new HttpError(403, 'No tienes permisos para realizar esta acción'));
    }
    return next();
  };
}

module.exports = { verificarToken, permitirRoles };
