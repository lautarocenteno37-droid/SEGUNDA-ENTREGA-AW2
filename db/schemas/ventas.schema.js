import mongoose from "mongoose";

const { Schema, models, model, ObjectId } = mongoose;

const ventasSchema = new Schema({
     // cada renglón del array guarda el ID del producto y cuántas unidades se compraron
     productos: [{
         _id: false, // Evita que Mongoose le cree un sub-id automático a cada renglón 
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