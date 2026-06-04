import mongoose from "mongoose";

const { Schema, models, model, ObjectId } = mongoose;

const ProductoSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imagen: { type: String, default: "" },  
    descripcion: { type: String, default: "" }, 
    marca: { type: String, default: "Genérica" },
    categoria: { type: String, lowercase: true, trim: true }
});

const Producto = models.Producto || model('Producto', ProductoSchema);

export default Producto;