const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token faltante o inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo admin" });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin };
