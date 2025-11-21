const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');

router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const q = await pool.query('SELECT * FROM logs WHERE organisation_id=$1 ORDER BY created_at DESC LIMIT 500', [orgId]);
  return res.json(q.rows);
});

module.exports = router;
