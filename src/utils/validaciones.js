const HttpError = require('./httpError');

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TELEFONO_REGEX = /^\+?[0-9 ]{8,15}$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/;

const ESPECIES = ['PERRO', 'GATO'];
const SEXOS = ['MACHO', 'HEMBRA'];
const TAMANOS = ['PEQUENO', 'MEDIANO', 'GRANDE'];
const ESTADOS_ANIMAL = ['BORRADOR', 'DISPONIBLE', 'RESERVADO', 'ADOPTADO', 'ARCHIVADO'];
const ESTADOS_POSTULACION = ['PENDIENTE', 'EN_REVISION', 'ACEPTADA_EN_PROCESO', 'ADOPCION_COMPLETADA', 'RECHAZADA'];
const CAMPOS_ANIMAL = ['nombre', 'especie', 'raza', 'sexo', 'edadMeses', 'tamano', 'estado', 'descripcion', 'salud', 'vacunado', 'esterilizado', 'fotoUrl'];
const CAMPOS_PERFIL = ['nombre', 'apellido', 'telefono', 'comuna'];
const MENSAJE_PASSWORD = 'Debe tener entre 8 y 72 caracteres, con mayúscula, minúscula y número';

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

// Lee ?pagina y ?limite. Si vienen con un valor inválido responde 400 en vez de ignorarlos
function paginacion(query, limitePorDefecto = 12) {
  const errores = [];
  const leer = (nombre, porDefecto, maximo) => {
    if (query[nombre] === undefined || query[nombre] === '') return porDefecto;
    const valor = Number(query[nombre]);
    if (!Number.isInteger(valor) || valor < 1 || valor > maximo) {
      errores.push({ campo: nombre, mensaje: `Debe ser un número entero entre 1 y ${maximo}` });
      return porDefecto;
    }
    return valor;
  };
  const pagina = leer('pagina', 1, 100000);
  const limite = leer('limite', limitePorDefecto, 50);
  if (errores.length > 0) {
    throw new HttpError(400, 'Parámetros de paginación no válidos', errores);
  }
  return { pagina, limite, offset: (pagina - 1) * limite };
}

// Lee un filtro opcional de la URL que debe pertenecer a una lista de valores permitidos.
// Un valor desconocido (por ejemplo ?especie=CABALLO) se registra como error en vez de ignorarse
function filtroEnum(query, nombre, permitidos, errores) {
  if (query[nombre] === undefined || query[nombre] === '') return undefined;
  const valor = String(query[nombre]).trim().toUpperCase();
  if (!permitidos.includes(valor)) {
    errores.push({ campo: nombre, mensaje: `Debe ser ${permitidos.join(', ')}` });
    return undefined;
  }
  return valor;
}

// Lee un filtro de texto opcional de la URL con largo máximo
function filtroTexto(query, nombre, maximo, errores) {
  if (query[nombre] === undefined || query[nombre] === '') return undefined;
  if (typeof query[nombre] !== 'string' || query[nombre].trim().length > maximo) {
    errores.push({ campo: nombre, mensaje: `Debe ser un texto de máximo ${maximo} caracteres` });
    return undefined;
  }
  return query[nombre].trim() || undefined;
}

function validarPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 72
    && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
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
  if (!validarPassword(password)) {
    errores.push({ campo: 'password', mensaje: MENSAJE_PASSWORD });
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

// PATCH: combina solo los campos enviados con los datos actuales del animal y valida el resultado completo
function validarAnimalParcial(body, actual) {
  const enviados = CAMPOS_ANIMAL.filter((campo) => body[campo] !== undefined);
  if (enviados.length === 0) {
    return { errores: [{ campo: 'body', mensaje: `Envía al menos uno de estos campos: ${CAMPOS_ANIMAL.join(', ')}` }], datos: null };
  }
  const combinado = { ...actual };
  enviados.forEach((campo) => { combinado[campo] = body[campo]; });
  const { errores, datos } = validarAnimal(combinado);
  // Solo se informan los errores de los campos que el cliente envió
  return { errores: errores.filter((e) => enviados.includes(e.campo)), datos };
}

// PATCH /auth/perfil: datos personales editables (el correo y el rol no se pueden cambiar)
function validarPerfil(body) {
  const errores = [];
  const enviados = CAMPOS_PERFIL.filter((campo) => body[campo] !== undefined);
  if (enviados.length === 0) {
    errores.push({ campo: 'body', mensaje: `Envía al menos uno de estos campos: ${CAMPOS_PERFIL.join(', ')}` });
    return { errores, datos: {} };
  }
  const datos = {};
  enviados.forEach((campo) => { datos[campo] = texto(body[campo]); });

  ['nombre', 'apellido'].forEach((campo) => {
    if (datos[campo] !== undefined && (datos[campo].length < 2 || datos[campo].length > 80)) {
      errores.push({ campo, mensaje: 'Debe tener entre 2 y 80 caracteres' });
    }
  });
  if (datos.telefono && !TELEFONO_REGEX.test(datos.telefono)) errores.push({ campo: 'telefono', mensaje: 'Teléfono no válido' });
  if (datos.comuna && datos.comuna.length > 80) errores.push({ campo: 'comuna', mensaje: 'Máximo 80 caracteres' });
  // Teléfono y comuna son opcionales: un texto vacío los deja en blanco
  if (datos.telefono === '') datos.telefono = null;
  if (datos.comuna === '') datos.comuna = null;

  return { errores, datos };
}

// PATCH /auth/password
function validarCambioPassword(body) {
  const errores = [];
  const passwordActual = typeof body.passwordActual === 'string' ? body.passwordActual : '';
  const passwordNueva = typeof body.passwordNueva === 'string' ? body.passwordNueva : '';
  if (!passwordActual) errores.push({ campo: 'passwordActual', mensaje: 'Ingresa tu contraseña actual' });
  if (!validarPassword(passwordNueva)) errores.push({ campo: 'passwordNueva', mensaje: MENSAJE_PASSWORD });
  else if (passwordNueva === passwordActual) errores.push({ campo: 'passwordNueva', mensaje: 'Debe ser distinta de la contraseña actual' });
  return { errores, datos: { passwordActual, passwordNueva } };
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
  filtroEnum,
  filtroTexto,
  rutValido,
  validarRegistro,
  validarLogin,
  validarAnimal,
  validarAnimalParcial,
  validarPerfil,
  validarCambioPassword,
  validarEstadoAnimal,
  validarPostulacion,
  validarEstadoPostulacion,
  exigir,
};
