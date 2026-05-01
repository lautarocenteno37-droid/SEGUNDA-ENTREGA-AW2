import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { get_user_byid } from '../utils/user.js';
import { get_producto_byid } from '../utils/producto.js';
import { get_pedido_byid } from '../utils/pedido.js';

const router = Router();
const filePedidos = await readFile('./data/pedidos.json', 'utf-8');
const pedidos = JSON.parse(filePedidos);

//endpoint para obtener todos los pedidos (get)
router.get('/', (req, res) => {
    res.json(pedidos);
}); 

//endpoint para buscar un pedido por id (get)
router.get('/byid/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let aux_nombre = ''; 
    let aux_producto = '';
    try {
    const pedido = pedidos.find(p => p.id_pedido === id);   
        if (pedido) {

            aux_nombre = get_user_byid(pedido.id_usuario);
            aux_nombre = aux_nombre.nombre + ' ' + aux_nombre.apellido;

            aux_producto = get_producto_byid(pedido.id_producto);
            aux_producto = aux_producto.descripcion;

            res.json({
                usuario: aux_nombre,
                productos: aux_producto,
                fecha: pedido.fecha,
                precio: pedido.precio,
                cantidad: pedido.cantidad,
                total: pedido.total,
                direccion: pedido.direccion
            });
        } else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el pedido' });
    }
});

//endpoint para eliminar un pedido por id (delete)
router.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id_pedido === id);
    if (index !== -1) {
        const pedidoEliminado = pedidos[index];
        pedidos.splice(index, 1);
        await writeFile('./data/pedidos.json', JSON.stringify(pedidos, null, 2));
        res.json( 'Pedido eliminado: ' + pedidoEliminado.descripcion + ' del usuario ' + get_user_byid(pedidoEliminado.id_usuario).nombre + ' ' + get_user_byid(pedidoEliminado.id_usuario).apellido + '- ID del usuario: ' + pedidoEliminado.id_usuario);
    } else {
        res.status(404).json({ error: 'Pedido no encontrado' });
    }
});

export default router;