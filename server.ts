import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import path from 'path';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./'));
app.use('/uploads', express.static('uploads'));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// फोटो कुठे सेव्ह करायचा त्याचे सेटिंग
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// फोटो अपलोड API
app.post('/api/upload', upload.single('profile'), async (req, res) => {
  const { userId } = req.body;
  if (!req.file) return res.status(400).json({ success: false, message: "फोटो निवडा!" });

  const imageUrl = `https://nodejs-65fz.onrender.com/uploads/${req.file.filename}`;

  try {
    await pool.query('UPDATE users SET profile_pic = $1 WHERE id = $2', [imageUrl, userId]);
    res.json({ success: true, url: imageUrl });
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
      res.status(401).json({ success: false, message: "चुकीचे डिटेल्स!" });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Talknik Server is LIVE`));
