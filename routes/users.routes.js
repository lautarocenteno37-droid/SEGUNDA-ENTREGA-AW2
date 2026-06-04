import { Router } from "express";
import dotenv from 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUser, findAllUsers, loginUser, deleteUserAndOrders } from "../db/actions/users.action.js";

const router = Router();

// 1. OBTENER TODOS LOS USUARIOS
router.get('/', async (req, res) => {
    try {
        const users = await findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}); 

// 2. CREAR UN NUEVO USUARIO (Registro)
router.post('/newUser', async (req, res) => {
    const { nombre, apellido, email, contraseña, direccion, telefono, rol } = req.body;
    try {
        const newUser = await createUser({ nombre, apellido, email, contraseña, direccion, telefono, rol });

        const secretoJWT = process.env.JWT_SECRET || 'ClaveSecretaDeRespaldoPorSiFallaElEnv';
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            secretoJWT,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            _id: newUser._id,
            nombre: newUser.nombre,
            email: newUser.email,
            direccion: newUser.direccion,
            rol: newUser.rol,
            token: token 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario. Asegúrate de que el email no esté duplicado.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        
        // 1. Buscamos al usuario por email únicamente
        const user = await loginUser(email); 

        if (!user) {
            console.log(`❌ No existe el email: ${email}`);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);

        if (!contraseñaValida) {
            console.log(`❌ Contraseña incorrecta para: ${email}`);
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const secretoJWT = process.env.JWT_SECRET || 'ClaveSecretaDeRespaldoPorSiFallaElEnv';
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            secretoJWT,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            direccion: user.direccion,
            rol: user.rol,
            token: token 
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN LOGIN:", error);
        return res.status(500).json({ error: 'Error interno en el servidor' });
    }
});
// 4. ELIMINAR UN USUARIO POR ID Y SUS PEDIDOS (Delete en cascada)
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const resultado = await deleteUserAndOrders(id);
        
        if (resultado) {
            res.status(200).json(
                `Usuario eliminado: ${resultado.user.nombre} ${resultado.user.apellido} con los siguientes pedidos eliminados de la BD: ${JSON.stringify(resultado.pedidosEliminados)}`
            );
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario y sus registros' });
    }
});

export default router;