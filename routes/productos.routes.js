import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { get_producto_byid } from '../utils/producto.js';
import { get_user_byid } from '../utils/user.js';
import { get_pedido_byid } from '../utils/pedido.js';

const fileProducto = await readFile('./data/productos.json', 'utf-8');
const productos = JSON.parse(fileProducto);
const router = Router();

//endpoint para obtener todos los productos (get)
router.get('/', (req, res) => {
    res.json(productos);
}); 

//endpoint para buscar un producto por marca (get)
router.get('/bymarca/:marca', (req, res) => {
    const marca = req.params.marca;
    const productosEncontrados = productos.filter(p => p.marca === marca);
    try {
        if (productosEncontrados.length > 0) {
            res.json({
                productos: productosEncontrados.map(p => ({
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    precio: p.precio,
                    marca: p.marca  
                }))
            });
        } else {
            res.status(404).json({ error: 'Productos no encontrados' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar los productos' });
    }
});

router.put('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, marca } = req.body;
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
        productos[index].nombre = nombre;
        productos[index].descripcion = descripcion;
        productos[index].precio = precio;
        productos[index].marca = marca;
        await writeFile('./data/productos.json', JSON.stringify(productos, null, 2));
        res.status(200).json( 'Producto actualizado: ' + productos[index].nombre + ' - ID del producto: ' + productos[index].id);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/newProduct', async (req, res) => {
    const { nombre, descripcion, precio, marca } = req.body;
    try {
        const newProduct = {
            id: productos.length + 1,
            nombre,
            descripcion,
            precio,
            marca
        };
        productos.push(newProduct);
        await writeFile('./data/productos.json', JSON.stringify(productos, null, 2));
        res.status(201).json( 'Producto creado: ' + newProduct.descripcion + ' - ID del producto: ' + newProduct.id);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

export default router;