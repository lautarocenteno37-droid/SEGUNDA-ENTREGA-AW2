import 'dotenv/config';
import express from 'express';
import { connectToDatabase } from './db/connection.js'; // Importamos tu función de conexión
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.static('./public')); // Movido arriba junto a los otros middlewares

// --- ENRUTADORES (API ROUTES) ---
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/users', usersRoutes);

// --- RUTA BASE DE PRUEBA ---
app.get('/status', (req, res) => {
  res.send('API de MongoDB activa y escuchando correctamente.');
});

// --- ARRANCAR SERVIDOR E INICIALIZAR BASE DE DATOS ---
app.listen(port, async () => {
  console.log(`🚀 Servidor activo en http://localhost:${port}`);
  try {
    // Intentamos conectar a MongoDB apenas levanta el servicio
    await connectToDatabase();
    console.log('📦 Conexión inicial a MongoDB establecida con éxito.');
  } catch (error) {
    console.error('❌ Error crítico al conectar a MongoDB durante el inicio:', error);
  }
}); //saludos