import { readFile } from 'fs/promises';

const filepedido = await readFile('./data/pedidos.json', 'utf-8');
const pedidos = JSON.parse(filepedido);

export const get_pedido_byid = (id) => { 
    return pedidos.find(p => p.id === id);
}