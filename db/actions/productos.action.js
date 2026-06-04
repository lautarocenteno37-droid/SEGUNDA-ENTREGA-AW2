import { connectToDatabase } from "../connection.js";
import ProductoSchema from "../schemas/productos.schema.js";

// 1. CREAR PRODUCTO (Le sumamos 'imagen' para que lo guarde en la DB)
export const createProducto = async (nombre, descripcion, precio, stock, marca, categoria, imagen) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.create({ 
            nombre, 
            descripcion, 
            precio, 
            stock, 
            marca,
            categoria,
            imagen: imagen || ''
        });
        console.log('Producto creado exitosamente:', res);
        return res;
    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw error;
    }
};

// 2. BUSCAR TODOS
export const findAll = async () => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.find(); 
        return res;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};

// 3. BUSCAR POR ID
export const findById = async (id) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.findById(id); 
        return res;
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        throw error;
    }
};

// 4. BUSCAR POR CATEGORÍA (O FILTRO DE NOMBRE)
export const findByCategoria = async (categoria) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.find({ categoria: categoria }); 
        return res;
    } catch (error) {
        console.error('Error al obtener los productos por categoría:', error);
        throw error;
    }
};

// 5. ACTUALIZAR PRODUCTO COMPLETO (🌟 NUEVO: Lo usa el PUT de tus rutas)
export const updateProducto = async (id, datosActualizados) => {
    try {
        await connectToDatabase();
        // { new: true } devuelve el documento ya modificado para mandarlo al frontend
        const res = await ProductoSchema.findByIdAndUpdate(id, datosActualizados, { new: true });
        console.log('Producto actualizado exitosamente:', res);
        return res;
    } catch (error) {
        console.error('Error al actualizar el producto en el action:', error);
        throw error;
    }
};

// 6. BORRAR PRODUCTO POR ID (🌟 NUEVO: Lo usa el DELETE de tus rutas)
export const deleteProducto = async (id) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.findByIdAndDelete(id);
        console.log('Producto eliminado exitosamente:', res);
        return res;
    } catch (error) {
        console.error('Error al eliminar el producto en el action:', error);
        throw error;
    }
};

// 7. ACTUALIZAR STOCK
export const updateStock = async (id, stock) => {
    try {
        await connectToDatabase();
        const res = await ProductoSchema.findByIdAndUpdate(id, { stock }, { new: true });
        return res;
    } catch (error) {
        console.error('Error al actualizar el stock del producto:', error);
        throw error;
    }
};