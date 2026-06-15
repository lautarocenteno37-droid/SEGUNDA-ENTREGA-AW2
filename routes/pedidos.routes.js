import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { createVenta, findAll, findById } from '../db/actions/ventas.action.js';
import Venta from '../db/schemas/ventas.schema.js'; 
import Producto from '../db/schemas/productos.schema.js';

const router = Router();

// 1. OBTENER TODOS LOS PEDIDOS
router.get('/', async (req, res) => {
    try {
        const { categoria } = req.query;
        let filtro = {};

        if (categoria) {

            // Buscamos productos en esa categoría
            const productosEnCategoria = await Producto.find({ 
                categoria: categoria.toLowerCase().trim() 
            }).select('_id nombre categoria');


            // Mapeamos solo los IDs
            const idsProductos = productosEnCategoria.map(p => p._id);

            // Filtramos las ventas
            filtro = { "productos.producto": { $in: idsProductos } };
        }

        const ventas = await Venta.find(filtro)
                        .populate('usuario', 'nombre email')
                        .populate('productos.producto')
                        .sort({ createdAt: -1 }); 

        res.status(200).json(ventas);
    } catch (error) {
        console.error("Error al obtener los pedidos filtrados:", error);
        res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
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

// 3. REGISTRAR UN PEDIDO Y RESTAR STOCK (POST)
router.post('/add', verificarToken, async (req, res) => {
    try {
        const carrito = req.body;

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }
        
        const usuarioId = req.usuarioLogueado.id || req.usuarioLogueado._id; 
        const direccionEntrega = carrito[0].direccion || 'No especificada';
        
        // Estructuramos los productos para el documento de la venta
        const productosParaGuardar = carrito.map(item => ({
            producto: item._id || item.id_producto, 
            cantidad: Number(item.cantidad) || 1,   
            precioUnitario: Number(item.precio)     
        }));

        const totalVenta = carrito.reduce((acc, item) => acc + (Number(item.precio) * (item.cantidad || 1)), 0);

        // 1. Creamos la venta en la base de datos
        const nuevaVenta = await Venta.create({
            productos: productosParaGuardar, 
            total: totalVenta,
            usuario: usuarioId, 
            direccion: direccionEntrega
        });

        // 🌟 2. CONTROL DE STOCK: Iteramos el carrito para restar las cantidades en MongoDB
        // Usamos un bucle for...of porque maneja operaciones asíncronas (await) de forma secuencial y segura
        for (const item of carrito) {
            const productoId = item._id || item.id_producto;
            const cantidadComprada = Number(item.cantidad) || 1;

            // Usamos el operador $inc de MongoDB pasándole un número negativo para restar
            await Producto.findByIdAndUpdate(
                productoId,
                { $inc: { stock: -cantidadComprada } }
            );
        }

        // Devolvemos el OK al cliente
        res.status(201).json({ message: 'Pedido creado con éxito y stock actualizado', venta: nuevaVenta });
    } catch (error) {
        console.error("Error al registrar el pedido y actualizar stock:", error);
        res.status(500).json({ error: 'Error al registrar el pedido' });
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