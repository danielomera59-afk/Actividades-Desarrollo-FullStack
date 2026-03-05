const fs = require("fs");
const path = require("path");

// ✁ECargar variables de entorno correctamente (Windows-friendly)
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });
// fallback por si sigues usando el archivo "process.env"
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

console.log("RUNNING FILE:", __filename);

app.get("/api/_whoami", (req, res) => {
  res.json({ file: __filename, hasAuthLogin: true });
});

// Static uploads
const uploadDir = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Solo imágenes PNG/JPG/WEBP"));
    }
    cb(null, true);
  }
});

const ARTISTS = {
  luna: { key: "luna", name: "Luna Sketch", base_mxn: 250 },
  nova: { key: "nova", name: "Nova Color", base_mxn: 450 },
  atlas: { key: "atlas", name: "Atlas Realism", base_mxn: 700 }
};

const TYPE_MULT = { bust: 1.0, half: 1.4, full: 1.9 };
const PRIORITY_MULT = { normal: 1.0, urgent: 1.25 };

function calcPriceMXN(artistKey, commissionType, priority) {
  const a = ARTISTS[artistKey];
  const t = TYPE_MULT[commissionType] ?? 1.0;
  const p = PRIORITY_MULT[priority] ?? 1.0;
  return Math.round(a.base_mxn * t * p * 100) / 100;
}

// -------------------- HEALTH CHECK --------------------
app.get("/api/health", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    next(err);
  }
});

// -------------------- AUTH (JWT + ROLES) --------------------

const authRouter = express.Router();

// función única de login (la usamos en /api/auth/login y /api/login)
async function handleLogin(req, res, next) {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT id, username, password_hash, role FROM users WHERE username = ?",
      [username]
    );

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
}

authRouter.get("/ping", (req, res) => res.json({ ok: true, auth: "up" }));

authRouter.post("/register", validateRegister, async (req, res, next) => {
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

authRouter.post("/login", validateLogin, handleLogin);

// Montaje FINAL
app.use("/api/auth", authRouter);

// Alias opcional (si lo quieres mantener)
app.post("/api/login", validateLogin, handleLogin);

// Perfil
app.get("/api/me", verifyToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
});

app.get("/api/commissions/summary", verifyToken, async (req, res, next) => {
  try {
    let where = "";
    const params = [];

    // user -> solo sus comisiones, admin -> todas
    if (req.user.role !== "admin") {
      where = "WHERE user_id = ?";
      params.push(req.user.id);
    }

    const [rows] = await pool.query(
      `
      SELECT
        COUNT(*) AS total,
        SUM(status='pending') AS pending,
        SUM(status='accepted') AS accepted,
        SUM(status='rejected') AS rejected
      FROM commissions
      ${where}
      `,
      params
    );

    const r = rows[0] || {};
    res.json({
      total: Number(r.total || 0),
      pending: Number(r.pending || 0),
      accepted: Number(r.accepted || 0),
      rejected: Number(r.rejected || 0),
    });
  } catch (err) {
    next(err);
  }
});

// -------------------- COMMISSIONS (CRUD + PAGINACIÓN/FILTROS) --------------------

app.get("/api/commissions", verifyToken, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const q = String(req.query.q || "").trim();

    let sql = `
      SELECT c.*, u.username AS owner_username
      FROM commissions c
      LEFT JOIN users u ON c.user_id = u.id
    `;
    const params = [];
    const where = [];

    if (status) { where.push("c.status = ?"); params.push(status); }

    if (req.user.role !== "admin") {
      where.push("c.user_id = ?");
      params.push(req.user.id);
    }

    if (q) {
      where.push(`(
        c.email LIKE ? OR c.description LIKE ? OR c.artist_name LIKE ? OR
        u.username LIKE ? OR CAST(c.id AS CHAR) LIKE ?
      )`);
      const like = `%${q}%`;
      params.push(like, like, like, like, like);
    }

    if (where.length > 0) sql += " WHERE " + where.join(" AND ");

    sql += ` ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.query(sql, params);
    res.json({ page, limit, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET by ID
app.get("/api/commissions/:id", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT c.*, u.username AS owner_username
       FROM commissions c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Comisión no encontrada" });

    const c = rows[0];
    if (req.user.role !== "admin" && c.user_id !== req.user.id) {
      return res.status(403).json({ message: "Acceso denegado: no es tu comisión" });
    }

    res.json(c);
  } catch (err) {
    next(err);
  }
});

// POST (con imagen)
app.post(
  "/api/commissions",
  verifyToken,
  upload.single("referenceImage"),
  validateCommission,
  async (req, res, next) => {
    try {
      if (req.user.role === "admin") {
        return res.status(403).json({ message: "El admin no puede crear comisiones" });
      }

      const { email, description } = req.body;
      const artistKey = String(req.body.artistKey).toLowerCase();
      const commissionType = String(req.body.commissionType || "bust").toLowerCase();
      const priority = String(req.body.priority || "normal").toLowerCase();
      const deadline = String(req.body.deadline || "").trim() || null;

      const artist = ARTISTS[artistKey];
      const price_mxn = calcPriceMXN(artistKey, commissionType, priority);
      const imageFilename = req.file ? req.file.filename : null;

      const [seqRows] = await pool.execute(
        "SELECT COALESCE(MAX(user_seq), 0) AS maxSeq FROM commissions WHERE user_id = ?",
        [req.user.id]
      );
      const nextSeq = Number(seqRows[0]?.maxSeq || 0) + 1;

      const [result] = await pool.execute(
        `INSERT INTO commissions
        (user_id, user_seq, email, description, artist_key, artist_name, price_mxn,
         commission_type, priority, deadline, reference_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id, nextSeq, email, description,
          artist.key, artist.name, price_mxn,
          commissionType, priority, deadline, imageFilename
        ]
      );

      const commissionId = result.insertId;

      await pool.execute(
        `INSERT INTO commission_status_history
         (commission_id, old_status, new_status, action, changed_by_user_id)
         VALUES (?, ?, ?, ?, ?)`,
        [commissionId, null, "pending", "created", req.user.id]
      );

      res.status(201).json({ message: "Solicitud creada", id: commissionId, user_seq: nextSeq, price_mxn });
    } catch (err) {
      next(err);
    }
  }
);

// PUT (admin) + opcional imagen
app.put(
  "/api/commissions/:id",
  verifyToken,
  verifyAdmin,
  upload.single("referenceImage"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, description, status } = req.body;
      const imageFilename = req.file ? req.file.filename : null;

      const allowedStatus = ["pending", "accepted", "rejected"];
      if (status !== undefined && !allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status inválido. Usa: pending | accepted | rejected" });
      }

      const fields = [];
      const params = [];

      if (email !== undefined) { fields.push("email = ?"); params.push(email); }
      if (description !== undefined) { fields.push("description = ?"); params.push(description); }
      if (status !== undefined) { fields.push("status = ?"); params.push(status); }
      if (imageFilename !== null) { fields.push("reference_image = ?"); params.push(imageFilename); }

      if (fields.length === 0) return res.status(400).json({ message: "No enviaste campos para actualizar" });

      params.push(id);

      const [result] = await pool.execute(
        `UPDATE commissions SET ${fields.join(", ")} WHERE id = ?`,
        params
      );

      if (result.affectedRows === 0) return res.status(404).json({ message: "Comisión no encontrada" });
      res.json({ message: "Comisión actualizada" });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH status (admin) -> ruta extra funcional (PDF)
app.patch("/api/commissions/:id/status", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatus = ["pending", "accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status inválido. Usa: pending | accepted | rejected" });
    }

    const [cur] = await pool.execute("SELECT status FROM commissions WHERE id = ?", [id]);
    if (cur.length === 0) return res.status(404).json({ message: "Comisión no encontrada" });

    const oldStatus = cur[0].status;
    const [result] = await pool.execute("UPDATE commissions SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Comisión no encontrada" });

    await pool.execute(
      `INSERT INTO commission_status_history
       (commission_id, old_status, new_status, action, changed_by_user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [id, oldStatus, status, "status_change", req.user.id]
    );

    res.json({ message: "Status actualizado" });
  } catch (err) {
    next(err);
  }
});

// DELETE (admin)
app.delete("/api/commissions/:id", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1) obtener dueno + folio
    const [rows] = await pool.execute(
      "SELECT user_id, user_seq FROM commissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Comision no encontrada" });

    const ownerId = rows[0].user_id;
    const deletedSeq = rows[0].user_seq;

    // 2) borrar
    const [result] = await pool.execute("DELETE FROM commissions WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Comision no encontrada" });

    // 3) reacomodar folios SOLO de ese usuario
    if (ownerId != null && deletedSeq != null) {
      await pool.execute(
        "UPDATE commissions SET user_seq = user_seq - 1 WHERE user_id = ? AND user_seq > ?",
        [ownerId, deletedSeq]
      );
    }

    res.json({ message: "Comision eliminada y folios reacomodados" });
  } catch (err) {
    next(err);
  }
});
// API externa: Exchange Rates
app.get("/api/exchange-rates", verifyToken, async (req, res, next) => {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();
    res.json({
      base: "USD",
      rates: { MXN: data?.rates?.MXN, EUR: data?.rates?.EUR }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/commissions/:id/history", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute("SELECT user_id FROM commissions WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Comisión no encontrada" });

    const ownerId = rows[0].user_id;
    if (req.user.role !== "admin" && ownerId !== req.user.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    const [hist] = await pool.execute(
      `SELECT h.*, u.username AS changed_by_username
       FROM commission_status_history h
       LEFT JOIN users u ON h.changed_by_user_id = u.id
       WHERE h.commission_id = ?
       ORDER BY h.changed_at ASC`,
      [id]
    );

    res.json(hist);
  } catch (err) {
    next(err);
  }
});

app.get("/api/admin/summary", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const [counts] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM commissions
       GROUP BY status`
    );

    const [rev] = await pool.query(`SELECT COALESCE(SUM(price_mxn), 0) AS revenue FROM commissions`);

    const out = { pending: 0, accepted: 0, rejected: 0, revenue_mxn: Number(rev[0].revenue || 0) };
    for (const r of counts) out[r.status] = Number(r.count);

    res.json(out);
  } catch (err) {
    next(err);
  }
});

function csvEscape(v) {
  const s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

app.get("/api/admin/commissions/export", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const status = req.query.status;
    const q = String(req.query.q || "").trim();

    let sql = `
      SELECT c.id, u.username AS owner, c.email, c.artist_name, c.price_mxn,
             c.commission_type, c.priority, c.deadline, c.status, c.created_at
      FROM commissions c
      LEFT JOIN users u ON c.user_id = u.id
    `;
    const params = [];
    const where = [];

    if (status) { where.push("c.status = ?"); params.push(status); }

    if (q) {
      where.push(`(
        c.email LIKE ? OR c.description LIKE ? OR c.artist_name LIKE ? OR
        u.username LIKE ? OR CAST(c.id AS CHAR) LIKE ?
      )`);
      const like = `%${q}%`;
      params.push(like, like, like, like, like);
    }

    if (where.length > 0) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY c.created_at DESC";

    const [rows] = await pool.query(sql, params);

    const header = ["id","owner","email","artist","price_mxn","type","priority","deadline","status","created_at"];
    const lines = [header.join(",")];

    for (const r of rows) {
      lines.push([
        r.id, r.owner, r.email, r.artist_name, r.price_mxn,
        r.commission_type, r.priority, r.deadline ?? "",
        r.status, r.created_at
      ].map(csvEscape).join(","));
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=commissions.csv");
    res.send(lines.join("\n"));
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use(errorHandler);

// -------------------- START SERVER (con prueba de DB) --------------------
async function start() {
  const PORT = process.env.PORT || 3000;

  // ✁ESi no cargó env, aborta con mensaje claro
  if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME) {
    console.error("❁EVariables DB faltantes. Revisa que /backend/.env exista y tenga DB_HOST, DB_USER, DB_PASS, DB_NAME");
    process.exit(1);
  }

  // ✁EProbar conexión DB antes de escuchar
  await pool.query("SELECT 1");

  app.listen(PORT, () => console.log(`✁EServidor listo en http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❁ENo se pudo iniciar el servidor:", err.message);
  process.exit(1);
});
