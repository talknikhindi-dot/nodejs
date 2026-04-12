import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// फाईल्स सर्वरवरून वाचण्यासाठी अचूक मार्ग
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login-panel.html', (req, res) => res.sendFile(path.join(__dirname, 'login-panel.html')));

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Talknik Server Live'));
