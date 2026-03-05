Daniell
daniel4318
En línea

☯꧁Chuy1029꧂۞

 — 06/02/2026 19:44
Osea npm init -y.
npm install express y
npm install mysql2
Daniell — 06/02/2026 19:45
gracias
Imagen
ya quedo
t lo paso?
☯꧁Chuy1029꧂۞

 — 06/02/2026 19:49
No, solo pon en el documento el codigo que vayas haciendo, el front no necesita de esos permisos, de ser necesario yo los puedo instalar aca
Daniell — 06/02/2026 19:50
que clase de tablas deberia de tener el MySQL?
☯꧁Chuy1029꧂۞

 — 06/02/2026 19:51
No se, las normales xd??
Las que veas correctas y necesarias tu
Daniell — 06/02/2026 19:52
okok
Daniell — 06/02/2026 21:28
ok ahora si ya termine
ahi si ocupas que te paso algo o te ayude me dices
Daniell — 08/02/2026 19:19
ey
oye
siempre como vaz con tu parte??
recuerda que el avance se entrega antes de clase
☯꧁Chuy1029꧂۞

 — 08/02/2026 22:12
Lo siento, es que me ocupe y estaba probando varias cosas, aqui te paso lo que tengo, agarra lo que gustes y necesites, el maestro mas que nada solo quiere ver un avance de nuestro proyecto a traves de un codigo funcional
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel - Comisiones</title>
    <link rel="stylesheet" href="styles.css">

dashboard.html
1 KB
const lista = document.getElementById("lista");

function agregar() {
    const texto = document.getElementById("nuevaComision").value;

    if (texto === "") return;

dashboard.js
1 KB
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login - Comisiones de Arte</title>
    <link rel="stylesheet" href="styles.css">

index.html
1 KB
function login() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    if (usuario === "" || password === "") {

login.js
1 KB
* {
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {

style.css
2 KB
☯꧁Chuy1029꧂۞

 — 09/02/2026 7:19
No puedo editar el github, asi que tu tienes que agregar los codigos que te pase
☯꧁Chuy1029꧂۞

 — 09/02/2026 12:45
Entregaste el trabajo??
Daniell — 09/02/2026 12:56
Si
Si quieres te entrégalotu también para estar seguros
Daniell — 09/02/2026 13:20
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer"); // Importamos Multer para las imágenes
const path = require("path"); // Para manejar las rutas de las carpetas y archivos
const fs = require("fs"); //Crea carpetas, y lee/borra archivos de dichas carpetas

Server1.js
5 KB
// Este middleware atrapa cualquier error que lances con next(error)
const errorHandler = (err, req, res, next) => {
    console.error(`[Error Log]: ${err.message}`);

    // Si el error no tiene un código de estado, le asignamos 500 (Error del servidor)
    const statusCode = err.statusCode || 500;

errorHandler.js
1 KB
const validateCommission = (req, res, next) => {
    const { email, description } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Por favor, proporciona un correo electrónico válido." });
    }

validator.js
1 KB
Tipo de archivo adjunto: unknown
privado.env
157 bytes
Tipo de archivo adjunto: unknown
Archivo.gitignore
27 bytes
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "Server1.js",
  "scripts": {

package.json
1 KB
{
  "name": "backend",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {

package-lock.json
43 KB
Daniell — 11/02/2026 13:45
oye
tienes el codigo del App.jxs del front-react??
☯꧁Chuy1029꧂۞

 — 18/02/2026 18:44
Oye, a ti te deja acceder a canvas??
Daniell — 18/02/2026 21:27
Si
Btw ya ve uniendo mi backsnd con tu frontend
Por si acaso lo pide para la semana que sigue
Daniell — ayer a las 12:01
Imagen
require('dotenv').config({ path: './process.env' });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

Server1.js
4 KB
Tipo de archivo adjunto: unknown
process.env
122 bytes
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "Server1.js",
  "scripts": {

package.json
1 KB
Tipo de archivo adjunto: unknown
Archivo.gitignore
27 bytes
const errorHandler = (err, req, res, next) => {
    console.error(`[Error Log]: ${err.message}`);

    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({

errorHandler.js
1 KB
const fs = require('fs');

const validateCommission = (req, res, next) => {
    const { email, description } = req.body;
    let errors = [];

validator.js
1 KB
const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga un token válido
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

authMiddleware.js
2 KB
const { validateCommission } = require('../middleware/validator');
const fs = require('fs');

jest.mock('fs'); // Mock para no borrar archivos reales

describe('Pruebas del Validador de Comisiones', () => {

validator.test.js
2 KB
☯꧁Chuy1029꧂۞

 — ayer a las 12:04
yo te paso lo mio ya que yo no tengo tu base de datos y no creo que funcione si no tengo el mismo o si??
Daniell — ayer a las 12:04
Solo cambia la parte del .env
Para que estén los datos de tu base de sql
Y ya
Imagen
Daniell — 19:07
hola
oye como vas con el proyecto?
☯꧁Chuy1029꧂۞

 — 20:54
Ya lo termine, lo siento, es que estaba dandole unos toques finales, deja te paso todo
Imagen
Imagen
Imagen
const request = require("supertest");
const app = require("../testApp");

describe("Auth tests", () => {
  const rnd = Math.floor(Math.random() * 1000000);
  const user = { username: `user_${rnd}`, password: "123456", role: "user" };

auth.test.js
2 KB
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../testApp");

describe("Commissions tests", () => {
  let adminToken;

commission.test.js
4 KB
const { validateCommission } = require("../middleware/validator");

describe("Pruebas del Validador de Comisiones", () => {
  test("Debe devolver error 400 si el email no tiene @", () => {
    const req = { body: { email: "correo_invalido", description: "Quiero un dibujo", artistKey: "luna" } };
    const res = {

validator.test.js
2 KB
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

authMiddleware.js
1 KB
function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  // Si ya se envió una respuesta, delega
  if (res.headersSent) return next(err);

errorHandler.js
1 KB
function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.length <= 255;
}

const ARTIST_KEYS = ["luna", "nova", "atlas"];
const TYPES = ["bust", "half", "full"];

validator.js
3 KB
const mysql = require('mysql2/promise');

function getPoolFromEnv() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS;

db.js
1 KB
Tipo de archivo adjunto: unknown
jest.config.cjs
67 bytes
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "Server1.js",
  "scripts": {

package.json
1 KB
{
  "name": "backend",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {... (Tiempo restante: 140 KB)

package-lock.json
190 KB
Tipo de archivo adjunto: unknown
process.env
128 bytes
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
... (453 líneas restantes)

Server1.js
18 KB
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
... (84 líneas restantes)

testApp.js
7 KB
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
react.svg
5 KB
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Navbar() {
  const { isAuthenticated, role, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [counts, setCounts] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let alive = true;

    async function loadCounts() {
      if (!isAuthenticated) return;
      try {
        const res = await api.get("/commissions/summary");
        if (alive) setCounts(res.data);
      } catch {
        // si falla, no pasa nada
      }
    }

    loadCounts();
    return () => { alive = false; };
  }, [isAuthenticated, location.pathname]);

  return (
    <header className="navBar">
      <div className="navInner">
        <Link className="brand" to="/">
          <span className="brandDot" />
          <span>ProyectoFinal</span>
        </Link>

        <nav className="navLinks">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
              </NavLink>
              {role !== "admin" && (
                <NavLink to="/commissions/new" className={({ isActive }) => (isActive ? "active" : "")}>
                  Nueva comision
                </NavLink>
              )}
              {role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Registro
              </NavLink>
            </>
          )}
        </nav>

        <div className="navRight">
          {isAuthenticated ? (
            <>
              <div className="pill" title="Conteo de comisiones visibles para tu rol">
                <span className="pillStrong">{username || "usuario"}</span>
                <span className="pillMuted">{role}</span>
                <span className="pillMuted">•</span>
                <span className="pillMuted">{counts.total} comisiones</span>
              </div>
              <button className="btn btnGhost" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <span className="mutedSmall">Sin sesión</span>
          )}
        </div>
      </div>
    </header>
  );
}

Navbar.jsx
3 KB
import React from "react";

export default function Pagination({ page, setPage, hasPrev, hasNext }) {
  return (
    <div className="pagination">
      <button className="btn btnGhost" disabled={!hasPrev} onClick={() => setPage(page - 1)}>

Pagination.jsx
1 KB
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

ProtectedRoute.jsx
1 KB
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ allow = ["admin"], children }) {
  const { role } = useAuth();

RoleGuard.jsx
1 KB
import React from "react";

export default function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  const cls =
    s === "accepted" ? "badge badgeOk" : s === "rejected" ? "badge badgeBad" : "badge badgeWarn";

StatusBadge.jsx
1 KB
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

Toast.jsx
2 KB
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

AuthContext.jsx
2 KB
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

AdminPanel.jsx
8 KB
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

CommissionDetail.jsx
9 KB
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";

function getNextSaturdayISO() {

CommissionForm.jsx
7 KB
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import StatusBadge from "../components/StatusBadge";

Dashboard.jsx
6 KB
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../components/Toast";

export default function EditCommission() {

EditCommission.jsx
4 KB
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import api from "../services/api";

Login.jsx
4 KB
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

export default function Register() {

Register.jsx
3 KB
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";

AppRoutes.jsx
2 KB
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 15000
});

api.js
1 KB
:root{
  --bg: #0b1020;
  --card: rgba(255,255,255,0.06);
  --card2: rgba(255,255,255,0.08);
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.65);

global.css
8 KB
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

App.css
1 KB
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

export default function App() {
  return (

app.jsx
1 KB
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;

index.css
2 KB
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";

main.jsx
1 KB
Tipo de archivo adjunto: unknown
.gitignore
253 bytes
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

eslint.config.js
1 KB
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

index.html
1 KB
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {

package.json
1 KB
{
  "name": "frontend",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {... (Tiempo restante: 63 KB)

package-lock.json
113 KB
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

README.md
2 KB
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {

vite.config.js
1 KB
Tipo de archivo adjunto: document
Reporte_Tecnico_ProyectoFinal.docx
39.96 KB
https://youtu.be/DNtRR33hgQo
YouTube
Chuy1029
Proyecto Final de Desarrollo Full Stack
Imagen
Ahora si, creo que ya es todo xd
Ahi ya tu haz lo que falte y veas necesario de hacer 
☯꧁Chuy1029꧂۞

 — 21:08
Oye, para que sepas, le hice un chingo de cambios al backend asi que te recomiendo checar el documento para que te enteres de todo y si quieres pidele a una IA que te lo explique para que sepas que responder cuando te pregunten
Daniell — 22:24
pasame un zip mejor😭
yaya vi como agragarte al github
pasa tu user o el correo con el que estas inscrito
Daniell — 22:55
ey me puedes pasar un zip del frontend
no se si en las carpetas que no estan abiertas no hay nada o si se te fue abrirlas
﻿
Aquí disfrutando de la vida, con sus buenas y malas =D
☯꧁Chuy1029꧂۞
chuy3847
Chuy

 
 
 
 
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Navbar() {
  const { isAuthenticated, role, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [counts, setCounts] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let alive = true;

    async function loadCounts() {
      if (!isAuthenticated) return;
      try {
        const res = await api.get("/commissions/summary");
        if (alive) setCounts(res.data);
      } catch {
        // si falla, no pasa nada
      }
    }

    loadCounts();
    return () => { alive = false; };
  }, [isAuthenticated, location.pathname]);

  return (
    <header className="navBar">
      <div className="navInner">
        <Link className="brand" to="/">
          <span className="brandDot" />
          <span>ProyectoFinal</span>
        </Link>

        <nav className="navLinks">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                Dashboard
              </NavLink>
              {role !== "admin" && (
                <NavLink to="/commissions/new" className={({ isActive }) => (isActive ? "active" : "")}>
                  Nueva comision
                </NavLink>
              )}
              {role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Registro
              </NavLink>
            </>
          )}
        </nav>

        <div className="navRight">
          {isAuthenticated ? (
            <>
              <div className="pill" title="Conteo de comisiones visibles para tu rol">
                <span className="pillStrong">{username || "usuario"}</span>
                <span className="pillMuted">{role}</span>
                <span className="pillMuted">•</span>
                <span className="pillMuted">{counts.total} comisiones</span>
              </div>
              <button className="btn btnGhost" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <span className="mutedSmall">Sin sesión</span>
          )}
        </div>
      </div>
    </header>
  );
}
