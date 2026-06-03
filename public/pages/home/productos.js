import { createProductItem } from '../../components/ProductItem.js';
// Importamos las funciones de control de sesión desde tu controlador
import { getSession, removeSession } from '../../utils/sessionstorage.controller.js';

// --- SEGURIDAD: CONTROL DE ACCESO ---
// Si un usuario intenta entrar escribiendo la URL sin haberse logueado, lo rebota al login
if (!getSession()) {
    window.location.href = '../../index.html';
}

const productContainer = document.getElementById('productContainer');

/**
 * Carga y filtra los productos desde MongoDB
 * Se expone en el objeto window para que los botones onclick nativos puedan ejecutarla
 */
window.loadProducts = async (category = 'all') => {
    try {
        const response = await fetch('http://localhost:3000/productos');
        let products = await response.json();

        // Filtrado dinámico por categoría basándose en la propiedad 'nombre' de tu documento en la BD
        if (category !== 'all') {
            products = products.filter(p => p.nombre === category);
        }

        if (productContainer) {
            if (products.length === 0) {
                productContainer.innerHTML = `
                    <div class="text-center py-20">
                        <p class="italic text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
                    </div>
                `;
                return;
            }
            // Mapea los productos usando tu componente ProductItem
            productContainer.innerHTML = products.map(p => createProductItem(p)).join('');
        }
    } catch (error) {
        console.error("Error al cargar productos desde MongoDB:", error);
        if (productContainer) {
            productContainer.innerHTML = `
                <p class="text-rose-500 font-bold text-center mt-10">Error al conectar con el servidor de productos.</p>
            `;
        }
    }
};

/**
 * Añade un producto seleccionado al almacenamiento local del carrito
 * Modificado para dar soporte tanto a estructuras viejas como a los _id nuevos de Mongo
 */
window.addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificamos si ya existe el producto en el carrito para incrementar su cantidad (Opcional pero recomendado)
    const idProducto = product._id || product.id;
    const productoExistente = cart.find(p => (p._id || p.id) === idProducto);

    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(cart));
    alert(`${product.nombre} ${product.marca || ''} se agregó con éxito al carrito.`);
};

document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (confirmar) {
        removeSession();
        localStorage.removeItem('carrito'); 
        window.location.href = '../../index.html'; 
    }
});

// Inicialización automática cuando la vista carga por completo
document.addEventListener('DOMContentLoaded', () => window.loadProducts('all'));