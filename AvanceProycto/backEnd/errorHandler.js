// Este middleware atrapa cualquier error que lances con next(error)
const errorHandler = (err, req, res, next) => {
    console.error(`[Error Log]: ${err.message}`);

    // Si el error no tiene un código de estado, le asignamos 500 (Error del servidor)
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "Error interno del servidor",
        // Solo mostramos el "stack" (donde falló) si no estamos en producción
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;