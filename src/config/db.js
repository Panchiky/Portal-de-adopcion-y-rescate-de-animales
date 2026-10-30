const { Pool } = require('pg');
const { db } = require('./env');

const pool = new Pool(db);

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a PostgreSQL:', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
