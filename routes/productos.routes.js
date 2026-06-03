import { Router } from 'express';
import { createProducto, findAll, findById, findByCategoria, updateStock } from "../db/actions/productos.action.js";

const router = Router();

// 1. RUTA RAÍZ: Cambiada para que responda directamente al catálogo del frontend
router.get('/', async (req, res) => {
    try {
        const productos = await findAll();
        // Devolvemos directamente el array para que el frontend pueda hacer el .filter() o .map() sin problemas
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// 2. BUSCAR POR ID
router.get('/byId/:id', async (req, res) => {
   try {
        const { id } = req.params;
        const producto = await findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
   }
});



// 4. CREAR PRODUCTO (POSTMAN / BACKOFFICE)
router.post('/create', async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    try {
        const nuevoProducto = await createProducto(nombre, descripcion, precio, stock);
        console.log('Producto creado con éxito:', nuevoProducto);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto en la ruta:', error);
        res.status(500).json({ error: 'Error al crear el producto en la ruta' });
    }
});

// 5. ACTUALIZAR STOCK (Se ejecuta internamente al procesar órdenes)
router.patch('/updateStock/:id', async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    try {
        const productoActualizado = await updateStock(id, stock);
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el stock en la ruta:', error);
        res.status(500).json({ error: 'Error al actualizar el stock en la ruta' });
    }
});

export default router;