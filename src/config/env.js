require('dotenv').config();

const requeridas = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}. Revisa el archivo .env`);
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
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },
};
