const express = require('express');
const router = express.Router();
const { pool } = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addLog } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Signup - create organisation admin
router.post('/signup', async (req, res) => {
  const { organisation_name, email, password } = req.body;
  if (!organisation_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    // create organisation
    const orgRes = await pool.query('INSERT INTO organisations (name) VALUES ($1) RETURNING id', [organisation_name]);
    const orgId = orgRes.rows[0].id;
    const hashed = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await pool.query('INSERT INTO users (id, organisation_id, email, password, role) VALUES ($1,$2,$3,$4,$5)', [userId, orgId, email, hashed, 'admin']);
    await addLog('system', `Organisation ${organisation_name} created (org_id=${orgId}) by ${email}`);
    return res.json({ message: 'Organisation created', orgId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.organisation_id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    await addLog(user.id, `User '${user.email}' logged in.`);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Logout (frontend can just discard token; but record if requested)
router.post('/logout', async (req, res) => {
  const { userId } = req.body;
  await addLog(userId || 'unknown', `User '${userId}' logged out.`);
  return res.json({ message: 'Logged out' });
});

module.exports = router;
