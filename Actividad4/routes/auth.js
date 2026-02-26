const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

//RUTA: REGISTRO
router.post('/register', async (req, res) => {
    const { username, password, rol } = req.body;
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Agregamos 'rol' al INSERT para que se guarde en MySQL
        const [result] = await db.execute(
            'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)', 
            [username, hashedPassword, rol || 'user'] // Si no envían rol, será 'user'
        );
        
        res.status(201).json({ mensaje: "Usuario registrado", id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "El usuario ya existe" });
        res.status(500).json({ error: "Error al registrar" });
    }
});

//RUTA: LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const user = rows[0];
        const passwordValida = await bcrypt.compare(password, user.password);
        
        if (!passwordValida) return res.status(401).json({ error: "Contraseña incorrecta" });

        // GENERAMOS EL TOKEN UNA SOLA VEZ (incluyendo el rol)
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                rol: user.rol // Esto es lo que leerá el roleMiddleware
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ mensaje: "Login exitoso", token });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
