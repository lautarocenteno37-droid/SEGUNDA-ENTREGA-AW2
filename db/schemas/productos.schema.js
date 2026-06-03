import mongoose from "mongoose";

const { Schema, models, model, ObjectId } = mongoose;

const ProductoSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    descripcion: { type: String, required: true },
    marca: { type: String, required: true }
});

const Producto = models.Producto || model('Producto', ProductoSchema);

export default Producto;