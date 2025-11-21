require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logsRoutes = require('./routes/logs');
const { initDB } = require('./utils/db');
const { authMiddleware } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

initDB().then(() => console.log('DB initialized')).catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/teams', authMiddleware, teamRoutes);
app.use('/api/logs', authMiddleware, logsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
