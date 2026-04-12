import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// Neon Database Connection (Direct)
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FJSkj3ei1Zom@ep-wispy-dust-amiz86q5-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

// १. टेबल सेटअप रूट
app.get('/setup', async (req, res) => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS talknik_users (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE);');
    res.send('<h1>✅ Database Table Ready!</h1>');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.get('/', (req, res) => res.send('<h1>Talknik Server is Online!</h1>'));

app.get('/api/hello', (req, res) => {
  res.json({ status: 'success', message: 'Talknik IT Backend is Working!' });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('-------------------------------------------');
  console.log('🚀 SUCCESS! Server is LIVE.');
  console.log('🔗 Link: http://localhost:3000/api/hello');
  console.log('-------------------------------------------');
});