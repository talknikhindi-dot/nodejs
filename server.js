const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Database Connection
const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpw@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

// Routes for HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/login-panel.html', (req, res) => res.sendFile(path.join(__dirname, 'login-panel.html')));

// --- नवीन जोडलेला LIVE TEST CODE ---
app.get('/test', (req, res) => {
  res.json({
    status: "Success",
    brand: "Talknik IT",
    message: "तुमचा सर्व्हर आता पूर्णपणे कार्यरत आहे!",
    serverTime: new Date().toLocaleString()
  });
});
// ----------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Active on port ${PORT}`));