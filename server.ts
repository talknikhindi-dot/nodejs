import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

// Neon Database Connection
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// १. टेस्ट रूट
app.get('/api/hello', (req, res) => {
  res.json({ message: "Talknik Server is Online & Database Connected!" });
});

// २. लॉगिन रूट (API Call साठी)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // युजर चेक करणे (Neon DB मध्ये)
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, message: "लॉगिन यशस्वी झाले!", user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "चुकीचे युजरनेम किंवा पासवर्ड!" });
    }
  } catch (err) {
    res.status(500).json({ error: "डेटाबेस एरर!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SUCCESS! Talknik Server is LIVE on port ${PORT}`);
});
