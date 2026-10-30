const db = require('../config/db');

async function estadoBaseDatos() {
  const { rows } = await db.query('SELECT NOW() AS hora, current_database() AS base');
  return rows[0];
}

module.exports = { estadoBaseDatos };
