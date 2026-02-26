const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../authMiddleware'); // El guardia
const otorgarAcceso = require('../roleMiddleware'); // El prefecto de roles

// Obtener productos (Cualquier usuario logueado)
router.get('/', verificarToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM productos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// Crear producto (SOLO ADMINS)
router.post('/', verificarToken, otorgarAcceso(['admin']), async (req, res) => {
    const { nombre, precio } = req.body;
    try {
        await db.execute('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        res.status(201).json({ mensaje: "Producto creado por el administrador" });
    } catch (err) {
        res.status(500).json({ error: "Error al crear producto" });
    }
});

module.exports = router;