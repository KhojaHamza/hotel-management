const pool = require('../config/db');

async function getHealth(req, res) {
  let database = 'up';
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    database = 'down';
  }
  res.status(200).json({ status: 'ok', database });
}

module.exports = { getHealth };