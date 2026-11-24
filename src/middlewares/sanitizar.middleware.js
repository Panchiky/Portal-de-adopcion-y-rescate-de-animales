// Normaliza los textos recibidos: quita espacios al inicio y al final y los caracteres de control
// invisibles (se conservan saltos de línea y tabulaciones). Las contraseñas no se tocan.
// No se eliminan "<" ni ">" porque alteraban lo que escribe el usuario (por ejemplo "<3").
// La protección contra XSS está en la salida: la API responde solo JSON y React escapa el
// texto al mostrarlo, así que un "<script>" guardado se ve como texto y nunca se ejecuta.
const CAMPOS_EXCLUIDOS = ['password', 'passwordActual', 'passwordNueva'];
// eslint-disable-next-line no-control-regex
const CARACTERES_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function limpiar(valor, clave) {
  if (typeof valor === 'string') {
    return CAMPOS_EXCLUIDOS.includes(clave) ? valor : valor.replace(CARACTERES_CONTROL, '').trim();
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
