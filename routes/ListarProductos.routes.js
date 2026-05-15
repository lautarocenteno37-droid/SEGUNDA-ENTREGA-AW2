import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();

// Función auxiliar para leer datos de cualquier archivo JSON
const getData = async (fileName) => {
    try {
        const fileData = await readFile(`./data/${fileName}`, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error(`Error leyendo ${fileName}:`, error);
        return [];
    }
};

// Obtener todos los productos
router.get('/', async (req, res) => {
    const productosData = await getData('productos.json');
    if (productosData.length > 0 || Array.isArray(productosData)) {
        res.status(200).json(productosData);
    } else {
        res.status(400).json({ status: false, message: "No se pudieron obtener los productos" });
    }
});

export default router;