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

export const findAll = async () => {
    try {
        await connectToDatabase();
        const res = await ventasSchema.find().populate({ path: 'productos' });
        console.log('Ventas encontradas:', res);
        return res;
    } catch (error) {
        console.error('Error al encontrar las ventas:', error);
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

