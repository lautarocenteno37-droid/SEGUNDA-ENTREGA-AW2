import { connectToDatabase } from "../connection.js";
import ProductoSchema from "../schemas/productos.schema.js";

// 1. Agregamos 'marca' porque ahora es obligatoria (required: true) en tu esquema
export const createProducto = async (nombre, descripcion, precio, stock, marca) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.create({ nombre, descripcion, precio, stock, marca });
        console.log('Producto creado exitosamente:', res);
        return res;
    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw error;
    }
};

// 2. Limpiamos el .populate porque ya no existe el campo categoria
export const findAll = async () => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.find(); // Sin populate
        return res;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};

// 3. Limpiamos el .populate también en la búsqueda por ID
export const findById = async (id) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.findById(id); // Sin populate
        return res;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
};

// 4. Corregimos para que busque por el campo 'nombre' (que guarda "Zapatilla", "Jean", etc.)
export const findByCategoria = async (categoria) => {
    try {
        await connectToDatabase();
        // Ahora busca donde el campo 'nombre' coincida con el texto del filtro
        const res = await ProductoSchema.find({ nombre: categoria }); 
        return res;
    } catch (error) {
        console.error('Error al obtener los productos por categoría:', error);
        throw error;
    }
};

export const updateStock = async (id, stock) => {
    try {
        await connectToDatabase();
        // Agregamos { new: true } para que devuelva el producto ya actualizado con el nuevo stock
        const res = await ProductoSchema.findByIdAndUpdate(id, { stock }, { new: true });
        return res;
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error);
        throw error;
    }
};