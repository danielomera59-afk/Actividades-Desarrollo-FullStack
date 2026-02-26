const express = require('express');
require('dotenv').config();
const app = express();

// 1. MIDDLEWARES GLOBALES
app.use(express.json()); // Para entender JSON
app.use(express.static('public')); // Para servir tu login.html

// 2. IMPORTAR LAS RUTAS (Los archivos de la carpeta /routes)
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');

// 3. VINCULAR RUTAS CON PREFIJOS
// Ahora sí, las URLs serán: http://localhost:3000/api/auth/register, etc.
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

// 4. INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Rutas cargadas: /api/auth y /api/productos`);
});