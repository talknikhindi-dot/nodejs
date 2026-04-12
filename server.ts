import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// सर्व HTML, CSS आणि JS फाईल्सना सर्व्हरवरून एक्सेस देण्यासाठी
app.use(express.static(path.join(__dirname, './')));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// लॉगिन API (Login)
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
    res.status(500).json({ success: false, message: "डेटाबेस एरर!" });
  }
});

// मुख्य पेजसाठी रूट
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Talknik Server is LIVE on port ${PORT}`));
