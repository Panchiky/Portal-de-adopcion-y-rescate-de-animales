require('dotenv').config();

const requeridas = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}. Revisa el archivo .env`);
}

// Una clave corta se puede adivinar por fuerza bruta y permitiría falsificar tokens
const LARGO_MINIMO_SECRETO = 32;
if (process.env.JWT_SECRET.length < LARGO_MINIMO_SECRETO) {
  throw new Error(
    `JWT_SECRET debe tener al menos ${LARGO_MINIMO_SECRETO} caracteres. `
    + "Genera una con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
  );
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  // Puede ser una lista separada por comas (ionic serve usa 8100 y vite 5173)
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:8100,http://localhost:5173').split(',').map((o) => o.trim()),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  // Servicio externo de mapas (OpenStreetMap Nominatim). No requiere clave, pero sí identificar la app
  geocodificacion: {
    url: process.env.GEOCODING_URL || 'https://nominatim.openstreetmap.org',
    userAgent: process.env.GEOCODING_USER_AGENT || 'PatitasGo/1.0 (proyecto academico PUCV)',
    timeoutMs: Number(process.env.GEOCODING_TIMEOUT_MS) || 5000,
  },
  // Cantidad de proxies delante de la API (0 en local). Permite que el límite de intentos cuente la IP real
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    // Se fija el algoritmo para que no se acepten tokens firmados con otro (por ejemplo "none")
    algoritmo: 'HS256',
  },
};
