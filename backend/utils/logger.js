const { pool } = require('./db');
async function addLog(userId, message) {
  try {
    // attempt to get organisation id if userId exists in users table
    let orgId = null;
    if (userId && userId !== 'system' && userId !== 'unknown') {
      const r = await pool.query('SELECT organisation_id FROM users WHERE id=$1', [userId]);
      if (r.rowCount) orgId = r.rows[0].organisation_id;
    }
    await pool.query('INSERT INTO logs (organisation_id,user_id,message) VALUES ($1,$2,$3)', [orgId, userId, message]);
  } catch (err) {
    console.error('Failed to write log', err);
  }
}
module.exports = { addLog };
