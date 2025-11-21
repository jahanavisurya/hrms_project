const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
  // On startup, optionally create tables if they don't exist using the schema file (helpful for quick demo with local postgres)
  const schema = fs.readFileSync(path.join(__dirname,'..','schema.sql'),'utf8');
  await pool.query(schema);
}

module.exports = { pool, initDB };
