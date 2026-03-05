function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  // Si ya se envió una respuesta, delega
  if (res.headersSent) return next(err);

  res.status(500).json({
    message: "Error interno del servidor",
    detail: err.message || "Unknown error"
  });
}

module.exports = errorHandler;