const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "process.env") });

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("./db");
const { validateCommission, validateRegister, validateLogin } = require("./middleware/validator");
const errorHandler = require("./middleware/errorHandler");
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- asegurar tablas en tests ---
async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin','user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      reference_image VARCHAR(255) NULL,
      status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
ensureSchema().catch(console.error);

// AUTH
app.post("/api/auth/register", validateRegister, async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const finalRole = role || "user";

    const [rows] = await pool.execute("SELECT id FROM users WHERE username = ?", [username]);
    if (rows.length > 0) return res.status(409).json({ message: "Username ya existe" });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, passwordHash, finalRole]
    );

    res.status(201).json({ message: "Usuario registrado", id: result.insertId, role: finalRole });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/login", validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.execute("SELECT id, username, password_hash, role FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) return res.status(401).json({ message: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
});

// COMMISSIONS
app.get("/api/commissions", verifyToken, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let sql = "SELECT * FROM commissions";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }

    // LIMIT/OFFSET sin placeholders
    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.query(sql, params);
    res.json({ page, limit, data: rows });
  } catch (err) {
    next(err);
  }
});

app.get("/api/commissions/:id", verifyToken, async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM commissions WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Comisión no encontrada" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post("/api/commissions", verifyToken, upload.single("referenceImage"), validateCommission, async (req, res, next) => {
  try {
    const { email, description } = req.body;
    const imageFilename = req.file ? req.file.filename : null;

    const [result] = await pool.execute(
      "INSERT INTO commissions (email, description, reference_image) VALUES (?, ?, ?)",
      [email, description, imageFilename]
    );

    res.status(201).json({ message: "Solicitud creada", id: result.insertId });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/commissions/:id/status", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["pending", "accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }

    const [result] = await pool.execute("UPDATE commissions SET status = ? WHERE id = ?", [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Comisión no encontrada" });

    res.json({ message: "Status actualizado" });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/commissions/:id", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const [result] = await pool.execute("DELETE FROM commissions WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Comisión no encontrada" });
    res.json({ message: "Comisión eliminada" });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

module.exports = app;
