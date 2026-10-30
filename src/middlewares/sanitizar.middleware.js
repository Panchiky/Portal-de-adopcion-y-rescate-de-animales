// Quita < y > de los textos recibidos para evitar XSS almacenado (las contraseñas no se tocan)
const CAMPOS_EXCLUIDOS = ['password'];

function limpiar(valor, clave) {
  if (typeof valor === 'string') {
    return CAMPOS_EXCLUIDOS.includes(clave) ? valor : valor.replace(/[<>]/g, '');
  }
  if (Array.isArray(valor)) {
    return valor.map((item) => limpiar(item));
  }
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, limpiar(v, k)]));
  }
  return valor;
}

function sanitizarBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = limpiar(req.body);
  }
  next();
}

module.exports = { sanitizarBody };
