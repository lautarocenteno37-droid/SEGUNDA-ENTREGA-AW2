import { connectToDatabase } from "../connection.js";
import UserSchema from "../schemas/users.schema.js";
import VentaSchema from "../schemas/ventas.schema.js"; // Importamos ventas para la eliminación en cascada

export const createUser = async (userData) => {
    try {
        await connectToDatabase();
        const res = await UserSchema.create(userData);
        console.log('Usuario creado en BD:', res);
        return res;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

export const findAllUsers = async () => {
    try {
        await connectToDatabase();
        return await UserSchema.find();
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        throw error;
    }
};

export const loginUser = async (email, contraseña) => {
    try {
        await connectToDatabase();
        // Buscamos un usuario que coincida con ambos campos
        const user = await UserSchema.findOne({ email, contraseña });
        return user;
    } catch (error) {
        console.error('Error en login (BD):', error);
        throw error;
    }
};

export const deleteUserAndOrders = async (id) => {
    try {
        await connectToDatabase();
        
        // 1. Buscamos al usuario para tener sus datos antes de borrarlo
        const user = await UserSchema.findById(id);
        if (!user) return null;

        // 2. Buscamos y eliminamos todas las ventas asociadas a este usuario
        // Como en tu ventas.schema guardamos el usuario (puede ser por su email o string), filtramos por esa propiedad
        const pedidosEliminados = await VentaSchema.find({ usuario: user.email });
        await VentaSchema.deleteMany({ usuario: user.email });

        // 3. Eliminamos definitivamente al usuario
        await UserSchema.findByIdAndDelete(id);

        return { user, pedidosEliminados };
    } catch (error) {
        console.error('Error al eliminar usuario en cascada:', error);
        throw error;
    }
};