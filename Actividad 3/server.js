const express = require('express');
const bodyParser = require('body-parser'); //
const fs = require('fs').promises; // Requerimiento: Uso de fs.promises
const jwt = require('jsonwebtoken'); //
const bcrypt = require('bcryptjs'); //

const app = express();
const CLAVE_SECRETA = 'mi_clave_secreta_escolar';

// Configuración de Middlewares
app.use(bodyParser.json());
app.use(express.json());

// --- MANEJO DE DATOS ASINCRÓNICO ---
async function gestionarArchivo(nombre, datos = null) {
    const ruta = `./${nombre}.json`;
    if (datos) {
        // Escritura asincrónica
        await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
    } else {
        // Lectura asincrónica
        try {
            const contenido = await fs.readFile(ruta, 'utf-8');
            return JSON.parse(contenido);
        } catch {
            return []; // Retorna arreglo vacío si el archivo no existe
        }
    }
}

// --- MIDDLEWARE DE AUTENTICACIÓN ---
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Acceso denegado');

    jwt.verify(token, CLAVE_SECRETA, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
}

//RUTAS DE AUTENTICACIÓN
app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const usuarios = await gestionarArchivo('usuarios');
        
        // Encriptación con bcryptjs
        const passwordHash = await bcrypt.hash(password, 10);
        usuarios.push({ id: Date.now(), email, password: passwordHash });
        
        await gestionarArchivo('usuarios', usuarios);
        res.status(201).send('Usuario registrado');
    } catch (error) { next(error); }
});

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const usuarios = await gestionarArchivo('usuarios');
        const usuario = usuarios.find(u => u.email === email);

        if (usuario && await bcrypt.compare(password, usuario.password)) {
            // Generación de Token JWT
            const token = jwt.sign({ id: usuario.id }, CLAVE_SECRETA, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) { next(error); }
});

// --- RUTAS API RESTFUL (TAREAS) ---
app.get('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await gestionarArchivo('tareas');
        res.json(tareas);
    } catch (error) { next(error); }
});

app.post('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const { titulo, descripcion } = req.body; // Requerimiento: titulo y descripcion
        const tareas = await gestionarArchivo('tareas');
        const nuevaTarea = { id: Date.now(), titulo, descripcion };
        tareas.push(nuevaTarea);
        await gestionarArchivo('tareas', tareas);
        res.status(201).send('Tarea creada');
    } catch (error) { next(error); }
});

app.put('/tareas/:id', autenticarToken, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        let tareas = await gestionarArchivo('tareas');
        const index = tareas.findIndex(t => t.id === id);
        if (index === -1) return res.status(404).send('No encontrada');
        
        tareas[index] = { ...tareas[index], ...req.body };
        await gestionarArchivo('tareas', tareas);
        res.send('Tarea actualizada');
    } catch (error) { next(error); }
});

app.delete('/tareas/:id', autenticarToken, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const tareas = (await gestionarArchivo('tareas')).filter(t => t.id !== id);
        await gestionarArchivo('tareas', tareas);
        res.send('Tarea eliminada');
    } catch (error) { next(error); }
});


app.get('/', (req, res) => {
    res.send('Servidor de Tareas Activo. Usa Postman para las rutas de la API.');
});

//MANEJO DE ERRORES GLOBAL
app.use((err, req, res, next) => {
    console.error(err.stack); // Debugging
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Lanzamiento del servidor
app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});