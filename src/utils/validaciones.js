const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TELEFONO_REGEX = /^\+?[0-9 ]{8,15}$/;

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function validarRegistro(body) {
  const errores = [];
  const nombre = texto(body.nombre);
  const apellido = texto(body.apellido);
  const email = texto(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const telefono = texto(body.telefono);
  const comuna = texto(body.comuna);

  if (nombre.length < 2 || nombre.length > 80) errores.push({ campo: 'nombre', mensaje: 'Debe tener entre 2 y 80 caracteres' });
  if (apellido.length < 2 || apellido.length > 80) errores.push({ campo: 'apellido', mensaje: 'Debe tener entre 2 y 80 caracteres' });
  if (!EMAIL_REGEX.test(email) || email.length > 150) errores.push({ campo: 'email', mensaje: 'Correo electrónico no válido' });
  if (password.length < 8 || password.length > 72 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    errores.push({ campo: 'password', mensaje: 'Debe tener entre 8 y 72 caracteres, con mayúscula, minúscula y número' });
  }
  if (telefono && !TELEFONO_REGEX.test(telefono)) errores.push({ campo: 'telefono', mensaje: 'Teléfono no válido' });
  if (comuna.length > 80) errores.push({ campo: 'comuna', mensaje: 'Máximo 80 caracteres' });

  return {
    errores,
    datos: { nombre, apellido, email, password, telefono: telefono || null, comuna: comuna || null },
  };
}

function validarLogin(body) {
  const errores = [];
  const email = texto(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_REGEX.test(email)) errores.push({ campo: 'email', mensaje: 'Correo electrónico no válido' });
  if (!password) errores.push({ campo: 'password', mensaje: 'La contraseña es obligatoria' });

  return { errores, datos: { email, password } };
}

module.exports = { validarRegistro, validarLogin };
