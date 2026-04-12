const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// फाईल्स शोधण्यासाठी रूट सेट करणे
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpW@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

// सर्व पेजेससाठी रूट्स
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login-panel.html', (req, res) => res.sendFile(path.join(__dirname, 'login-panel.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// रजिस्टर API
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Talknik Server Active on ' + PORT));
