const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Konfigurasi koneksi ke MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Route untuk menampilkan semua data
app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Route untuk mendapatkan data berdasarkan ID
app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM notes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).json({ message: "Data tidak ditemukan!" });
    } else {
      res.json(result[0]);
    }
  });
});

// Route untuk menambahkan data baru
app.post("/notes", (req, res) => {
  const { title, datetime, note } = req.body;
  const sql = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  db.query(sql, [title, datetime, note], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Data berhasil ditambahkan!", id: result.insertId });
    }
  });
});

// Route untuk memperbarui data berdasarkan ID
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;
  const sql = "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?";
  db.query(sql, [title, datetime, note, id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Data berhasil diperbarui!" });
    }
  });
});

// Route untuk menghapus data berdasarkan ID
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM notes WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Data berhasil dihapus!" });
    }
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
