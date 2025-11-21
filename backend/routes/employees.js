const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const { addLog } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Get employees for organisation
router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const q = await pool.query('SELECT * FROM employees WHERE organisation_id=$1 ORDER BY created_at DESC', [orgId]);
  return res.json(q.rows);
});

router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const { name, email, role } = req.body;
  const id = uuidv4();
  const r = await pool.query('INSERT INTO employees (id, organisation_id, name, email, role) VALUES ($1,$2,$3,$4,$5) RETURNING *', [id, orgId, name, email, role]);
  await addLog(req.user.userId, `User '${req.user.email}' added a new employee with ID ${id}.`);
  return res.json(r.rows[0]);
});

router.put('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;
  const { name, email, role } = req.body;
  const r = await pool.query('UPDATE employees SET name=$1, email=$2, role=$3, updated_at=now() WHERE id=$4 AND organisation_id=$5 RETURNING *', [name, email, role, id, orgId]);
  await addLog(req.user.userId, `User '${req.user.email}' updated employee ${id}.`);
  return res.json(r.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;
  await pool.query('DELETE FROM employee_team WHERE employee_id=$1 AND organisation_id=$2', [id, orgId]);
  await pool.query('DELETE FROM employees WHERE id=$1 AND organisation_id=$2', [id, orgId]);
  await addLog(req.user.userId, `User '${req.user.email}' deleted employee ${id}.`);
  return res.json({ message: 'Deleted' });
});

// Assign teams (body: employeeId, teamIds[])
router.post('/assign', async (req, res) => {
  const orgId = req.user.orgId;
  const { employeeId, teamIds } = req.body;
  if (!Array.isArray(teamIds)) return res.status(400).json({ error: 'teamIds must be array' });
  // remove existing for this org/employee
  await pool.query('DELETE FROM employee_team WHERE employee_id=$1 AND organisation_id=$2', [employeeId, orgId]);
  const ps = teamIds.map(tid => pool.query('INSERT INTO employee_team (employee_id, team_id, organisation_id) VALUES ($1,$2,$3)', [employeeId, tid, orgId]));
  await Promise.all(ps);
  await addLog(req.user.userId, `User '${req.user.email}' assigned employee ${employeeId} to teams [${teamIds.join(',')}].`);
  return res.json({ message: 'Assigned' });
});

module.exports = router;
