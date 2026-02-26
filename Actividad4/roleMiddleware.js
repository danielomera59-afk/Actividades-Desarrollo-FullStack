// roleMiddleware.js

const otorgarAcceso = (rolesPermitidos) => {
    return (req, res, next) => {
        // 1. El usuario ya fue autenticado por el primer middleware (verificarToken)
        // Por lo tanto, req.usuario ya tiene los datos del token.
        
        if (!req.usuario) {
            return res.status(401).json({ mensaje: "No autenticado" });
        }

        // 2. Revisamos si el rol del usuario está en la lista de permitidos
        if (rolesPermitidos.includes(req.usuario.rol)) {
            next(); // El rol es correcto, dejamos pasar
        } else {
            res.status(403).json({ 
                mensaje: `Acceso denegado: Se requiere rol [${rolesPermitidos}] y tú eres [${req.usuario.rol}]` 
            });
        }
    };
};

module.exports = otorgarAcceso;