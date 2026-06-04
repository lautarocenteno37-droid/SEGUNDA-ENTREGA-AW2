import { connectToDatabase } from "../connection.js";
import ventasSchema from "../schemas/ventas.schema.js";

export const createVenta = async (productos, total, usuario) => {
    try {
        await connectToDatabase();
        const res = await ventasSchema.create({ productos, total, usuario });
        console.log('Venta creada:', res);
        return res;
    } catch (error) {
        console.error('Error al crear la venta:', error);
        throw error;
    }
};

export const findAll = async (filtro = {}) => {
    try {
        await connectToDatabase();
        
        // Buscamos con el filtro y encadenamos los populates
        const res = await ventasSchema.find(filtro)
            .populate('usuario', 'nombre email') // Trae solo nombre y mail del comprador
            .populate('productos.producto');     // Trae los datos de los productos (nombre, precio, etc.)
            
        return res;
    } catch (error) {
        console.error('Error al obtener las ventas en el action:', error);
        throw error;
    }
};

export const findById = async (id) => {
    try {
        await connectToDatabase();
        const res = await ventasSchema.findById(id).populate({ path: 'productos' });
        console.log('Venta encontrada:', res);
        return res;
    } catch (error) {
        console.error('Error al encontrar la venta:', error);
        throw error;
    }
};

