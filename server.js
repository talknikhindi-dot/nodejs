const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: 'postgres://neondb_owner:npg_P9v8EAsRMTpw@ep-cool-butterfly-a1mrebe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

// Signup API
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query('INSERT INTO users (username, password) VALUES (, )', [username, password]);
        res.json({ success: true, message: "??????????? ?????? ????!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "???? ???? ??? ????? ??????? ???!" });
    }
});

// Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username =  AND password = ', [username, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "????? ??????!" });
        } else {
            res.json({ success: false, message: "??????? ????? ??????? ?????? ???!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "??????? ???!" });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Active on port ' + PORT));
