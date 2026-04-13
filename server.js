const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection (Updated with correct format)
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpw@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

// ?. Test Route
app.get('/test', (req, res) => {
  res.json({ status: "Success", brand: "Talknik IT", message: "Database system integrated!" });
});

// ?. Registration API (???? ???? ???????????)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
    await pool.query('INSERT INTO users (username, password) VALUES (, )', [username, password]);
    res.json({ success: true, message: "Registration Successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "User already exists or DB Error" });
  }
});

// ?. Login API (????????????)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username =  AND password = ', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Welcome to Talknik IT!" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Talknik Server Running'));
