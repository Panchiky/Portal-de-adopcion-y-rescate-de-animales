const authService = require('../services/auth.service');
const { validarRegistro, validarLogin } = require('../utils/validaciones');
const HttpError = require('../utils/httpError');

async function registro(req, res, next) {
  try {
    const { errores, datos } = validarRegistro(req.body);
    if (errores.length > 0) {
      throw new HttpError(400, 'Datos de registro no válidos', errores);
    }
    const resultado = await authService.registrar(datos);
    res.status(201).json({ ok: true, data: resultado });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { errores, datos } = validarLogin(req.body);
    if (errores.length > 0) {
      throw new HttpError(400, 'Datos de inicio de sesión no válidos', errores);
    }
    const resultado = await authService.login(datos);
    res.status(200).json({ ok: true, data: resultado });
  } catch (err) {
    next(err);
  }
}

async function perfil(req, res, next) {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    res.status(200).json({ ok: true, data: usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = { registro, login, perfil };
