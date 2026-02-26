const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado; // Guardamos los datos del usuario en la petición
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token no válido o expirado." });
    }
};

module.exports = verificarToken;
