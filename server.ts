import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// टेबल तयार करण्यासाठी (जर नसेल तर)
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      profile_pic TEXT
    );
  `);
};
initDB();

// नोंदणी API (Register)
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );
    res.json({ success: true, message: "नोंदणी यशस्वी!", id: result.rows[0].id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: "डेटाबेस एरर: " + err.message });
  }
});

// लॉगिन API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "लॉगिन यशस्वी!", user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "चुकीचे नाव किंवा पासवर्ड!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "सर्व्हर एरर!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Talknik Server is LIVE`));
