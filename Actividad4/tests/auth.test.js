const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const db = require('../db');

// Mockear la base de datos para no afectar la real
jest.mock('../db');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Pruebas de Autenticación', () => {
    
    // Prueba de Registro
    test('Debería registrar un nuevo usuario exitosamente', async () => {
        db.execute.mockResolvedValue([{ insertId: 1 }]); 

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'TestUser',
                password: 'password123',
                rol: 'user'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.mensaje).toBe('Usuario registrado');
    });

    // Prueba de Login
    test('Debería devolver un token si las credenciales son correctas', async () => {
        // Simulamos que encontramos al usuario con contraseña encriptada
        db.execute.mockResolvedValue([[{ 
            id: 1, 
            username: 'TestUser', 
            password: 'hash_simulado', 
            rol: 'user' 
        }]]);

        // Forzamos que bcrypt.compare siempre devuelva true para esta prueba
        const bcrypt = require('bcryptjs');
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'TestUser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // Prueba de Error
    test('Debería fallar si el usuario no existe', async () => {
        db.execute.mockResolvedValue([[]]); 

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'Inexistente',
                password: '123'
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Usuario no encontrado'); 
    });
});
