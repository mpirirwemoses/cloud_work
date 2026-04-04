import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

app.use(cors());
app.use(express.json());

// ==================== AUTH ====================

// Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User created" });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(400).json({ message: "User not found" });

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Wrong password" });

      const token = jwt.sign({ id: user.id }, JWT_SECRET);

      res.json({ token, message: "Login successful" });
    }
  );
});

// ==================== CRUD ====================

// Get users
app.get("/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ==================== SERVE FRONTEND ====================

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});