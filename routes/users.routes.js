import  { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { get_user_byid } from "../utils/user.js";
import { get_pedido_byid } from "../utils/pedido.js";
import { get_producto_byid } from "../utils/producto.js";

const fileUser = await readFile("./data/users.json", "utf-8");
const users = JSON.parse(fileUser);
const router = Router();

const filePedidos = await readFile('./data/pedidos.json', 'utf-8');
const pedidos = JSON.parse(filePedidos);

//endpoint para obtener todos los usuarios (get)
router.get('/', (req, res) => {
    res.json(users);
}); 

//endpoint para crear un nuevo usuario (post)
router.post('/newUser', async (req, res) => {
    const { nombre, apellido, email, contraseña, direccion, telefono } = req.body;
    try {
        const newUser = {
            id: users.length + 1,
            nombre,
            apellido,
            email,
            contraseña,
            direccion,
            telefono
        };
        users.push(newUser);
        await writeFile('./data/users.json', JSON.stringify(users, null, 2));
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

//endpoint para iniciar sesion (post)
router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;
    const user = users.find(u => u.email === email && u.contraseña === contraseña);
    try {
    if (user) {
        res.status(200).json({ message: 'BIENVENIDO ' + user.nombre + ' ' + user.apellido
        , datos: {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            direccion: user.direccion,
            telefono: user.telefono
        }
        });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

//endpoint para eliminar un usuario por id (delete)
router.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    let aux_pedidos = '';
    if (index !== -1) {
        aux_pedidos = pedidos.filter(p => p.id_usuario === id);
        const userEliminado = users[index];
        const pedidosEliminados = pedidos.filter(p => p.id_usuario === id);
        pedidosEliminados.forEach(p => {
            const pedidoIndex = pedidos.findIndex(pe => pe.id_pedido === p.id_pedido);
            if (pedidoIndex !== -1) {
                pedidos.splice(pedidoIndex, 1);
            }
        });
        users.splice(index, 1);
        await writeFile('./data/users.json', JSON.stringify(users, null, 2));
        await writeFile('./data/pedidos.json', JSON.stringify(pedidos, null, 2));
        res.json( 'Usuario eliminado: ' + userEliminado.nombre + ' ' + userEliminado.apellido + ' con los siguientes pedidos eliminados: ' + JSON.stringify(pedidosEliminados));
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

export default router;