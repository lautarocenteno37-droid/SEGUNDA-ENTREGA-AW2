import { createProductItem } from '../../components/ProductItem.js';

const productContainer = document.getElementById('productContainer');

window.loadProducts = async (category = 'all') => {
    try {
        const response = await fetch('http://localhost:3000/productos');
        let products = await response.json();

        if (category !== 'all') {
            products = products.filter(p => p.nombre === category);
        }

        if (productContainer) {
            productContainer.innerHTML = products.map(p => createProductItem(p)).join('');
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};

// LocalStorage
window.addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    cart.push(product);
    localStorage.setItem('carrito', JSON.stringify(cart));
    alert(`${product.nombre} ${product.marca} se guardó en el Carrito de Compras`);
};

document.addEventListener('DOMContentLoaded', () => loadProducts('all'));