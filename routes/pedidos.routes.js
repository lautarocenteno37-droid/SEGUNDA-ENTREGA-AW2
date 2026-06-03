import { Router } from 'express';
import { createVenta, findAll, findById } from '../db/actions/ventas.action.js';
import Venta from '../db/schemas/ventas.schema.js'; // Importamos el esquema directamente para el borrado

const router = Router();

// 1. OBTENER TODOS LOS PEDIDOS (GET)
// Tu action "findAll" ya viene con .populate({ path: 'productos' })
// Ruta para obtener pedidos (Filtrado por usuario)
router.get('/', async (req, res) => {
    try {
        const { usuario } = req.query; // Captura el ?usuario=ID de la URL
        
        let filtro = {};
        
        // Si el frontend envió el ID del usuario, armamos el filtro para MongoDB
        if (usuario) {
            filtro = { usuario: usuario }; 
        } else {
            // Seguridad: Si intentan entrar directo a /pedidos sin loguearse, no les mostramos nada
            return res.status(400).json({ error: 'Se requiere especificar un usuario' });
        }

        // Buscamos en la colección 'Venta' aplicando el filtro y haciendo populate de los productos
        const pedidosData = await Venta.find(filtro).populate('productos');
        
        res.status(200).json(pedidosData);
    } catch (error) {
        console.error("Error obteniendo pedidos de MongoDB:", error);
        res.status(500).json({ error: "No se pudieron obtener los pedidos" });
    }
});

// 2. BUSCAR UN PEDIDO POR ID (GET)
router.get('/byid/:id', async (req, res) => {
    try {
        const { id } = req.params; // ID de MongoDB (String hexadecimal largo)
        const pedido = await findById(id);   
        
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el pedido' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const carrito = req.body; // Array de productos enviados desde el carrito.js

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Extraemos los datos necesarios del primer elemento del carrito
        const usuarioId = carrito[0].usuario;     // _id de MongoDB del usuario logueado
        const direccionEntrega = carrito[0].direccion; // Dirección real del usuario
        const productosIds = carrito.map(item => item._id);
        const totalVenta = carrito.reduce((acc, item) => acc + (Number(item.precio) * (item.cantidad || 1)), 0);
        const nuevaVenta = await Venta.create({
            productos: productosIds,
            total: totalVenta,
            usuario: usuarioId,       
            direccion: direccionEntrega 
        });

        res.status(201).json({ message: 'Pedido creado con éxito en MongoDB', venta: nuevaVenta });
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        res.status(500).json({ error: 'Error al registrar el pedido en la base de datos' });
    }
});

// 4. ELIMINAR UN PEDIDO POR ID (DELETE)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoEliminado = await Venta.findByIdAndDelete(id);

        if (pedidoEliminado) {
            res.status(200).json(`Pedido #${id} eliminado con éxito de la base de datos.`);
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

export default router;