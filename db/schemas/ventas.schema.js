import mongoose from "mongoose";

const { Schema, models, model, ObjectId } = mongoose;

const ventasSchema = new Schema({
     productos: [{
         _id: false, 
         producto: { type: ObjectId, ref: 'Producto', required: true },
         cantidad: { type: Number, required: true, default: 1 },
         precioUnitario: { type: Number } // 
     }],
     total: { type: Number, required: true },
     usuario: { type: ObjectId, ref: 'User', required: true },
     direccion: { type: String, required: true }
},{ timestamps: true });

const Venta = models.Venta || model('Venta', ventasSchema);

export default Venta;