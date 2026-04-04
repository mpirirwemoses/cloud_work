import express from "express";
import mysql from "mysql";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());



db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Ensure table exists
db.query(
  `CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`,
  (err) => {
    if (err) console.log("Error creating table:", err);
  }
);

// Get all activities
app.get("/activities", (req, res) => {
  db.query("SELECT * FROM activities", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new activity
app.post("/activities", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Activity name required" });

  db.query("INSERT INTO activities (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, name });
  });
});

// Update activity
app.put("/activities/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Activity name required" });

  db.query("UPDATE activities SET name = ? WHERE id = ?", [name, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ id, name });
  });
});

// Delete activity
app.delete("/activities/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM activities WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted successfully", id });
  });
});


