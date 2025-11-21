const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const { addLog } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const q = await pool.query('SELECT *, (SELECT COUNT(*) FROM employee_team et WHERE et.team_id = teams.id AND et.organisation_id=$1) AS members_count FROM teams WHERE organisation_id=$1 ORDER BY created_at DESC', [orgId]);
  return res.json(q.rows);
});

router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const { name, description } = req.body;
  const id = uuidv4();
  const r = await pool.query('INSERT INTO teams (id, organisation_id, name, description) VALUES ($1,$2,$3,$4) RETURNING *', [id, orgId, name, description]);
  await addLog(req.user.userId, `User '${req.user.email}' created team ${id}.`);
  return res.json(r.rows[0]);
});

router.put('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;
  const { name, description } = req.body;
  const r = await pool.query('UPDATE teams SET name=$1, description=$2, updated_at=now() WHERE id=$3 AND organisation_id=$4 RETURNING *', [name, description, id, orgId]);
  await addLog(req.user.userId, `User '${req.user.email}' updated team ${id}.`);
  return res.json(r.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;
  await pool.query('DELETE FROM employee_team WHERE team_id=$1 AND organisation_id=$2', [id, orgId]);
  await pool.query('DELETE FROM teams WHERE id=$1 AND organisation_id=$2', [id, orgId]);
  await addLog(req.user.userId, `User '${req.user.email}' deleted team ${id}.`);
  return res.json({ message: 'Deleted' });
});

module.exports = router;
