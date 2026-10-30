const app = require('./app');
const { port } = require('./config/env');
const { pool } = require('./config/db');

async function iniciar() {
  try {
    await pool.query('SELECT 1');
    console.log('Conectado a PostgreSQL');
  } catch (err) {
    console.error('No se pudo conectar a PostgreSQL:', err.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`API PatitasGo escuchando en http://localhost:${port}/api`);
  });
}

iniciar();
