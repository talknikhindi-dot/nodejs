import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// ही ओळ महत्त्वाची आहे: यामुळे तुमच्या सर्व HTML फाईल्स ब्राऊजरमध्ये दिसतील
app.use(express.static('./')); 
app.use('/uploads', express.static('uploads'));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// Hello API
app.get('/api/hello', (req, res) => {
  res.json({ message: "Talknik Server is Online & Database Connected!" });
});

// लॉगिन API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "लॉगिन यशस्वी!", user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "चुकीचे युजरनेम किंवा पासवर्ड!" });
    }
  } catch (err) {
    res.status(500).json({ error: "डेटाबेस एरर!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Talknik Server is LIVE`));
