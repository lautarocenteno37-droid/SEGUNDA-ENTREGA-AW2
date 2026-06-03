import { Router } from "express";
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
    const { nombre, apellido, email, contraseña, direccion, telefono } = req.body;
    try {
        const newUser = await createUser({ nombre, apellido, email, contraseña, direccion, telefono });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario. Asegúrate de que el email no esté duplicado.' });
    }
});

// 3. INICIAR SESIÓN (Login)
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const user = await loginUser(email, contraseña);
        
        if (user) {
            // Devolvemos el objeto completo incluyendo el ._id que generó MongoDB para el sessionStorage del frontend
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// 4. ELIMINAR UN USUARIO POR ID Y SUS PEDIDOS (Delete en cascada)
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // El ID de Mongo viene como String numérico/hexadecimal largo
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