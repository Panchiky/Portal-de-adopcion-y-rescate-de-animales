const { Pool } = require('pg');
const { db } = require('./env');

const pool = new Pool(db);

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a PostgreSQL:', err.message);
});

// Ejecuta varias consultas como una sola transacción (todo o nada)
async function transaccion(fn) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await fn(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  transaccion,
};
