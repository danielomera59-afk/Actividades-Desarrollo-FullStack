const validateCommission = (req, res, next) => {
    const { email, description } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Por favor, proporciona un correo electrónico válido." });
    }

    if (!description || description.length < 10) {
        return res.status(400).json({ error: "La descripción debe tener al menos 10 caracteres." });
    }

    // Si todo está bien, pasamos a la siguiente función (el controlador)
    next();
};

module.exports = { validateCommission };