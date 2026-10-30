const HttpError = require('./httpError');

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TELEFONO_REGEX = /^\+?[0-9 ]{8,15}$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;

const ESPECIES = ['PERRO', 'GATO'];
const SEXOS = ['MACHO', 'HEMBRA'];
const TAMANOS = ['PEQUENO', 'MEDIANO', 'GRANDE'];
const ESTADOS_ANIMAL = ['BORRADOR', 'DISPONIBLE', 'RESERVADO', 'ADOPTADO', 'ARCHIVADO'];
const ESTADOS_POSTULACION = ['PENDIENTE', 'EN_REVISION', 'ACEPTADA_EN_PROCESO', 'ADOPCION_COMPLETADA', 'RECHAZADA'];

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function mayusculas(valor) {
  return texto(valor).toUpperCase();
}

function idValido(valor, nombre = 'id') {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `El parámetro ${nombre} debe ser un número entero positivo`);
  }
  return id;
}

function paginacion(query) {
  const pagina = Math.max(parseInt(query.pagina, 10) || 1, 1);
  const limite = Math.min(Math.max(parseInt(query.limite, 10) || 12, 1), 50);
  return { pagina, limite, offset: (pagina - 1) * limite };
}

function rutValido(rut) {
  const limpio = rut.replace(/\./g, '').toUpperCase();
  if (!/^\d{7,8}-[\dK]$/.test(limpio)) return false;
  const [cuerpo, dv] = limpio.split('-');
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado;
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

function validarAnimal(body) {
  const errores = [];
  const datos = {
    nombre: texto(body.nombre),
    especie: mayusculas(body.especie),
    raza: texto(body.raza) || null,
    sexo: mayusculas(body.sexo),
    edadMeses: Number(body.edadMeses),
    tamano: mayusculas(body.tamano),
    estado: body.estado === undefined ? 'BORRADOR' : mayusculas(body.estado),
    descripcion: texto(body.descripcion) || null,
    salud: texto(body.salud) || null,
    vacunado: body.vacunado === undefined ? false : body.vacunado,
    esterilizado: body.esterilizado === undefined ? false : body.esterilizado,
    fotoUrl: texto(body.fotoUrl) || null,
  };

  if (datos.nombre.length < 2 || datos.nombre.length > 60) errores.push({ campo: 'nombre', mensaje: 'Debe tener entre 2 y 60 caracteres' });
  if (!ESPECIES.includes(datos.especie)) errores.push({ campo: 'especie', mensaje: `Debe ser ${ESPECIES.join(' o ')}` });
  if (datos.raza && datos.raza.length > 60) errores.push({ campo: 'raza', mensaje: 'Máximo 60 caracteres' });
  if (!SEXOS.includes(datos.sexo)) errores.push({ campo: 'sexo', mensaje: `Debe ser ${SEXOS.join(' o ')}` });
  if (!Number.isInteger(datos.edadMeses) || datos.edadMeses < 0 || datos.edadMeses > 360) errores.push({ campo: 'edadMeses', mensaje: 'Debe ser un entero entre 0 y 360' });
  if (!TAMANOS.includes(datos.tamano)) errores.push({ campo: 'tamano', mensaje: `Debe ser ${TAMANOS.join(', ')}` });
  if (!ESTADOS_ANIMAL.includes(datos.estado)) errores.push({ campo: 'estado', mensaje: `Debe ser ${ESTADOS_ANIMAL.join(', ')}` });
  if (datos.descripcion && datos.descripcion.length > 2000) errores.push({ campo: 'descripcion', mensaje: 'Máximo 2000 caracteres' });
  if (datos.salud && datos.salud.length > 1000) errores.push({ campo: 'salud', mensaje: 'Máximo 1000 caracteres' });
  if (typeof datos.vacunado !== 'boolean') errores.push({ campo: 'vacunado', mensaje: 'Debe ser true o false' });
  if (typeof datos.esterilizado !== 'boolean') errores.push({ campo: 'esterilizado', mensaje: 'Debe ser true o false' });
  if (datos.fotoUrl && (!URL_REGEX.test(datos.fotoUrl) || datos.fotoUrl.length > 300)) errores.push({ campo: 'fotoUrl', mensaje: 'Debe ser una URL http(s) de máximo 300 caracteres' });

  return { errores, datos };
}

function validarEstadoAnimal(body) {
  const estado = mayusculas(body.estado);
  const errores = ESTADOS_ANIMAL.includes(estado) ? [] : [{ campo: 'estado', mensaje: `Debe ser ${ESTADOS_ANIMAL.join(', ')}` }];
  return { errores, datos: { estado } };
}

function validarPostulacion(body) {
  const errores = [];
  const datos = {
    animalId: Number(body.animalId),
    rut: texto(body.rut).toUpperCase(),
    telefono: texto(body.telefono),
    comuna: texto(body.comuna),
    tipoVivienda: texto(body.tipoVivienda),
    otrasMascotas: texto(body.otrasMascotas) || null,
    motivacion: texto(body.motivacion),
    aceptaTerminos: body.aceptaTerminos,
  };

  if (!Number.isInteger(datos.animalId) || datos.animalId <= 0) errores.push({ campo: 'animalId', mensaje: 'Animal no válido' });
  if (!rutValido(datos.rut)) errores.push({ campo: 'rut', mensaje: 'RUT no válido (formato 12.345.678-5)' });
  if (!TELEFONO_REGEX.test(datos.telefono)) errores.push({ campo: 'telefono', mensaje: 'Teléfono no válido' });
  if (datos.comuna.length < 2 || datos.comuna.length > 80) errores.push({ campo: 'comuna', mensaje: 'Debe tener entre 2 y 80 caracteres' });
  if (datos.tipoVivienda.length < 3 || datos.tipoVivienda.length > 40) errores.push({ campo: 'tipoVivienda', mensaje: 'Debe tener entre 3 y 40 caracteres' });
  if (datos.otrasMascotas && datos.otrasMascotas.length > 120) errores.push({ campo: 'otrasMascotas', mensaje: 'Máximo 120 caracteres' });
  if (datos.motivacion.length < 20 || datos.motivacion.length > 2000) errores.push({ campo: 'motivacion', mensaje: 'Debe tener entre 20 y 2000 caracteres' });
  if (datos.aceptaTerminos !== true) errores.push({ campo: 'aceptaTerminos', mensaje: 'Debes aceptar los términos de adopción' });

  return { errores, datos };
}

function validarEstadoPostulacion(body) {
  const errores = [];
  const estado = mayusculas(body.estado);
  const motivoRechazo = texto(body.motivoRechazo) || null;
  const detalle = texto(body.detalle) || null;

  if (!ESTADOS_POSTULACION.includes(estado)) errores.push({ campo: 'estado', mensaje: `Debe ser ${ESTADOS_POSTULACION.join(', ')}` });
  if (estado === 'RECHAZADA' && (!motivoRechazo || motivoRechazo.length < 10)) {
    errores.push({ campo: 'motivoRechazo', mensaje: 'Indica el motivo del rechazo (mínimo 10 caracteres)' });
  }
  if (motivoRechazo && motivoRechazo.length > 500) errores.push({ campo: 'motivoRechazo', mensaje: 'Máximo 500 caracteres' });
  if (detalle && detalle.length > 500) errores.push({ campo: 'detalle', mensaje: 'Máximo 500 caracteres' });

  return { errores, datos: { estado, motivoRechazo, detalle } };
}

// Lanza 400 con el detalle por campo si la validación falló
function exigir({ errores, datos }, mensaje = 'Datos no válidos') {
  if (errores.length > 0) {
    throw new HttpError(400, mensaje, errores);
  }
  return datos;
}

module.exports = {
  ESPECIES,
  SEXOS,
  TAMANOS,
  ESTADOS_ANIMAL,
  ESTADOS_POSTULACION,
  idValido,
  paginacion,
  rutValido,
  validarRegistro,
  validarLogin,
  validarAnimal,
  validarEstadoAnimal,
  validarPostulacion,
  validarEstadoPostulacion,
  exigir,
};
