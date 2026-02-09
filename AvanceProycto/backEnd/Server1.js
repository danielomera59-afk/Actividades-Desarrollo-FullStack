const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer"); // Importamos Multer para las imágenes
const path = require("path"); // Para manejar las rutas de las carpetas y archivos
const fs = require("fs"); //Crea carpetas, y lee/borra archivos de dichas carpetas
const { validateCommission } = require("./validator"); 
const errorHandler = require("./errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir la carpeta 'uploads' como estática para poder ver las imágenes desde el front
// Ejemplo: http://localhost:3000/uploads/nombre-imagen.jpg
app.use('/uploads', express.static('uploads'));

// Verificar si la carpeta 'uploads' existe, si no, crearla
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

//CONFIGURACIÓN DE MULTER (Subida de archivos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //Carpeta donde se guardan
    },
    filename: (req, file, cb) => {
        //Nombramos el archivo con la fecha actual + extensión original para evitar duplicados
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// CONEXIÓN A BASE DE DATOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Daniel',
    password: 'patitopelud666', 
    database: "proyecto1" 
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD:', err);
    } else {
        console.log('✅ Conectado a MySQL');
    }
});

//RUTAS (ENDPOINTS)

// 1. Obtener todas las comisiones (Para el panel del artista)
app.get('/api/commissions', (req, res) => {
    const query = 'SELECT * FROM commissions ORDER BY created_at DESC';
    
    db.execute(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Crear nueva solicitud de comisión (Con imagen)
// 'referenceImage' es el nombre del campo que debe usar el Frontend al enviar el archivo
app.post('/api/commissions', upload.single('referenceImage'), (req, res) => {
    // Multer procesa el archivo primero, luego tenemos acceso a req.body y req.file
    
    const { email, description } = req.body;
    const imageFilename = req.file ? req.file.filename : null; // Guardamos solo el nombre del archivo

    // Validaciones básicas
    if (!email || !description) {
        return res.status(400).json({ error: 'El email y la descripción son obligatorios' });
    }

    const query = 'INSERT INTO commissions (email, description, reference_image) VALUES (?, ?, ?)';

    db.execute(query, [email, description, imageFilename], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: 'Solicitud de comisión enviada con éxito',
            id: result.insertId,
            image: imageFilename
        });
    });
});

// 3. Actualizar estado de la comisión (Ej: Aceptar o Rechazar)
app.put('/api/commissions/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // El artista envía: { "status": "aceptada" }

    const query = 'UPDATE commissions SET status = ? WHERE id = ?';

    db.execute(query, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comisión no encontrada' });
        }
        res.json({ message: 'Estado actualizado' });
    });
});

// 4. Eliminar una comisión
app.delete('/api/commissions/:id', (req, res) => {
    const { id } = req.params;
    
    // Primero, opcionalmente, podrías buscar la imagen para borrarla del disco también
    // pero por ahora solo borraremos el registro de la BD
    const query = 'DELETE FROM commissions WHERE id = ?';

    db.execute(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comisión no encontrada' });
        }
        res.json({ message: 'Solicitud eliminada' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🎨 Servidor de Arte corriendo en http://localhost:${PORT}`);
});