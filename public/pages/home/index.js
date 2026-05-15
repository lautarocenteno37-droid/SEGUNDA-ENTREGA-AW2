import { createNavbar, initNavbar } from '../../components/navbar.js';
import { createProductCard } from '../../components/ProductCard.js';

// 1. Renderizar Navbar
const header = document.getElementById('main-navbar');
if (header) {
    header.innerHTML = createNavbar();
    initNavbar(); // Activamos el botón del móvil
}

// 2. Renderizar Productos (el código que ya teníamos)
const productos = await fetch('../../data/productos.js').then(r => r.json());
const container = document.getElementById('product-container');

if (container) {
    container.innerHTML = productos.map(p => createProductCard(p)).join('');
}