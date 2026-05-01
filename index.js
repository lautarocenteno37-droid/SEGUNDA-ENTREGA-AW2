import express from 'express';
import {readFile, writeFile} from 'fs/promises';
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/users', usersRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});










