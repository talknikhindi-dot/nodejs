import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

app.get('/api/hello', (req, res) => {
  res.json({ message: "Talknik Server is Online & Database Connected!" });
});

// नवीन युजर रजिस्ट्रेशन API
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );
    res.json({ success: true, message: "युजर यशस्वीरित्या नोंदवला गेला!", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, message: "नोंदणी करताना चूक झाली!", error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
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
app.listen(PORT, () => console.log(`Talknik Server is LIVE`));
// ... तुमच्या जुन्या कोडमध्ये हा नवीन रूट ॲड करा ...

app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT username, email, profile_pic FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "युजर सापडला नाही!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ... बाकी कोड ...
