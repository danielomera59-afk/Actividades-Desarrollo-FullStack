function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.length <= 255;
}

const ARTIST_KEYS = ["luna", "nova", "atlas"];
const TYPES = ["bust", "half", "full"];
const PRIORITIES = ["normal", "urgent"];

function validateCommission(req, res, next) {
  const { email, description, artistKey, commissionType, priority, deadline } = req.body;

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Email inválido" });
  }
  if (typeof description !== "string" || description.trim().length < 5) {
    return res.status(400).json({ message: "Descripción inválida (mínimo 5 caracteres)" });
  }

  const aKey = String(artistKey || "").toLowerCase();
  if (!ARTIST_KEYS.includes(aKey)) {
    return res.status(400).json({ message: "Artist inválido. Usa: luna | nova | atlas" });
  }

  if (commissionType !== undefined) {
    const t = String(commissionType).toLowerCase();
    if (!TYPES.includes(t)) return res.status(400).json({ message: "commissionType inválido: bust|half|full" });
  }

  if (priority !== undefined) {
    const p = String(priority).toLowerCase();
    if (!PRIORITIES.includes(p)) return res.status(400).json({ message: "priority inválida: normal|urgent" });
  }

  if (deadline !== undefined && String(deadline).trim() !== "") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(deadline))) {
      return res.status(400).json({ message: "deadline inválida. Usa YYYY-MM-DD" });
    }
  }

  next();
}

function validateRegister(req, res, next) {
  const { username, password, role } = req.body;

  if (typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({ message: "Username inválido (mínimo 3 caracteres)" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password inválido (mínimo 6 caracteres)" });
  }

  if (role !== undefined && role !== "admin" && role !== "user") {
    return res.status(400).json({ message: "Role inválido. Usa admin o user" });
  }

  next();
}

function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== "string" || username.trim().length === 0) {
    return res.status(400).json({ message: "Username requerido" });
  }

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ message: "Password requerido" });
  }

  next();
}

module.exports = { validateCommission, validateRegister, validateLogin };