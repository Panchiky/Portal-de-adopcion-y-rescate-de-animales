const authService = require('../services/auth.service');
const {
  validarRegistro, validarLogin, validarPerfil, validarCambioPassword, exigir,
} = require('../utils/validaciones');
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

async function actualizarPerfil(req, res, next) {
  try {
    const datos = exigir(validarPerfil(req.body), 'Datos del perfil no válidos');
    const usuario = await authService.actualizarPerfil(req.usuario.id, datos);
    res.status(200).json({ ok: true, data: usuario });
  } catch (err) {
    next(err);
  }
}

async function cambiarPassword(req, res, next) {
  try {
    const datos = exigir(validarCambioPassword(req.body), 'Datos no válidos');
    await authService.cambiarPassword(req.usuario.id, datos);
    res.status(200).json({ ok: true, data: { mensaje: 'Contraseña actualizada' } });
  } catch (err) {
    next(err);
  }
}

module.exports = { registro, login, perfil, actualizarPerfil, cambiarPassword };
