import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import path from 'path';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());

// फाईल्स एक्सेस करण्यासाठी हे महत्त्वाचे आहे
app.use(express.static(path.join(__dirname, './')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// रजिस्टर API
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );
    res.json({ success: true, message: "नोंदणी यशस्वी!", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, message: "डेटाबेस एरर!" });
  }
});

// लॉगिन API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "चुकीचे नाव किंवा पासवर्ड!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "सर्व्हर एरर!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Talknik Server is LIVE`));
