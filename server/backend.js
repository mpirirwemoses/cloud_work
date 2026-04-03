import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "crud_app",
});

db.connect((err) => {
  if (err) return console.error("DB Error:", err);
  console.log("MySQL Connected");
});

// ==================== SIGNUP ====================
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error", err });
    res.json({ message: "User created", id: result.insertId });
  });
});

// ==================== LOGIN ====================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", err });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  });
});

// ==================== CRUD ====================

// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT id, name, email, age FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get single user
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, age FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// Update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, age=? WHERE id=?",
    [name, email, age, id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated" });
    }
  );
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});