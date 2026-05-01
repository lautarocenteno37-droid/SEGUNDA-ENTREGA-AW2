import { readFile } from 'fs/promises';

const fileproducto = await readFile('./data/productos.json', 'utf-8');
const productos = JSON.parse(fileproducto);

export const get_producto_byid = (id) => { 
    return productos.find(p => p.id === id);
}