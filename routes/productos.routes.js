import { Router } from 'express';
import { 
    createProducto, 
    findAll, 
    findById, 
    updateProducto, 
    deleteProducto, 
    updateStock 
} from "../db/actions/productos.action.js";
import Producto from '../db/schemas/productos.schema.js';

const router = Router();

// 1. OBTENER TODOS LOS PRODUCTOS (CATÁLOGO / DASHBOARD)
router.get('/', async (req, res) => {
    try {
        const { categoria } = req.query;
        
        let filtro = {};
        if (categoria) {
            filtro = { categoria: categoria.toLowerCase().trim() };
        }
        const productos = await Producto.find(filtro);
        
        res.status(200).json(productos);
    } catch (error) {
        
        console.error('ERROR CRÍTICO AL BUSCAR PRODUCTOS:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
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
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
   }
});

// 3. CREAR PRODUCTO (POST)
router.post(['/', '/create'], async (req, res) => {
    const { nombre, descripcion, precio, stock, marca, imagen, categoria } = req.body;
    try {
        // Llamamos directamente a tu action actualizado respetando el orden de los parámetros
        const nuevoProducto = await createProducto(nombre, descripcion, precio, stock, marca, categoria, imagen);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto en la ruta:', error);
        res.status(500).json({ error: 'Error al crear el producto en la ruta' });
    }
});

// 4. MODIFICAR PRODUCTO EXISTENTE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Le pasamos al action el ID y el req.body (que trae los datos nuevos del formulario)
        const productoActualizado = await updateProducto(id, req.body);

        if (!productoActualizado) {
            return res.status(404).json({ error: 'No se encontró el producto para actualizar' });
        }

        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el producto en la ruta:', error);
        res.status(500).json({ error: 'Error interno al actualizar el producto' });
    }
});

// 5. BORRAR PRODUCTO 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productoEliminado = await deleteProducto(id);

        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito del catálogo' });
    } catch (error) {
        console.error('Error al eliminar el producto en la ruta:', error);
        res.status(500).json({ error: 'Error interno al eliminar el producto' });
    }
});

// 6. ACTUALIZAR STOCK INTERNO (PATCH)
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