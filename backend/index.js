const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./medicare.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    dosage TEXT,
    frequency TEXT,
    taken INTEGER DEFAULT 0,
    date TEXT
  )`);
});

// Signup route
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  db.run(
    `INSERT INTO users(username, password) VALUES (?, ?)`,
    [username, hashed],
    function (err) {
      if (err) return res.status(400).json({ error: "User already exists" });
      res.json({ id: this.lastID });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, "secretkey");
    res.json({ token });
  });
});

// Add medication
app.post("/medications", (req, res) => {
  const { user_id, name, dosage, frequency, date } = req.body;
  db.run(
    `INSERT INTO medications(user_id, name, dosage, frequency, date) VALUES (?, ?, ?, ?, ?)`,
    [user_id, name, dosage, frequency, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Get medications
app.get("/medications/:user_id", (req, res) => {
  const userId = req.params.user_id;
  db.all(`SELECT * FROM medications WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Mark as taken
app.put("/medications/:id", (req, res) => {
  const medId = req.params.id;
  db.run(`UPDATE medications SET taken = 1 WHERE id = ?`, [medId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.get("/", (req, res) => {
  res.send("✅ MediCare Backend is Running");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
