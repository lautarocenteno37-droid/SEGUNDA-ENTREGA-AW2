import { createProductItem } from '../../components/ProductItem.js';
import { getSession, removeSession } from '../../utils/sessionstorage.controller.js';

// --- SEGURIDAD: CONTROL DE ACCESO ---
if (!getSession()) {
    window.location.href = '../../index.html';
}

const productContainer = document.getElementById('productContainer');

// Variable global en el objeto window para recordar los productos traídos del backend
window.listaProductosGlobal = [];

/**
 * Carga y filtra los productos desde MongoDB
 */
window.loadProducts = async (category = 'all') => {
    try {
        // Si no es 'all', le pedimos al backend solo esa categoría
        const url = category !== 'all' 
            ? `http://localhost:3000/productos?categoria=${encodeURIComponent(category)}`
            : 'http://localhost:3000/productos';

        const response = await fetch(url);
        let products = await response.json();

        // Guardamos para uso global (carrito)
        window.listaProductosGlobal = Array.isArray(products) ? products : [];

        if (productContainer) {
            if (window.listaProductosGlobal.length === 0) {
                productContainer.innerHTML = `<p class="text-center py-20 text-gray-500">No hay productos en esta categoría.</p>`;
                return;
            }
            productContainer.innerHTML = window.listaProductosGlobal.map(p => createProductItem(p)).join('');
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};

/**
 * 🌟 CONTROL DE INTERFAZ: Modifica el número visual del contador de cada tarjeta
 */
window.cambiarCantidad = (id, cambio) => {
    const contador = document.getElementById(`cantidad-${id}`);
    if (!contador) return;

    // Buscamos el producto en la lista global para saber su stock
    const producto = window.listaProductosGlobal.find(p => (p._id || p.id) === id);
    const stockDisponible = producto ? producto.stock : 99; // Si no hay producto, limitamos a 99

    let cantidadActual = parseInt(contador.innerText);
    cantidadActual += cambio;

    // Lógica de límites
    if (cantidadActual < 1) cantidadActual = 1; 
    if (cantidadActual > stockDisponible) {
        cantidadActual = stockDisponible; // Bloqueamos en el tope de stock
        alert(`Solo tenemos ${stockDisponible} unidades disponibles.`);
    }
    contador.innerText = cantidadActual;
};
/**
 * 🌟 AÑADIR CON CANTIDAD: Captura las unidades elegidas y las empuja al localStorage
 */
window.agregarAlCarritoConCantidad = (id) => {
    // 1. Buscamos el producto en memoria
    const productoEncontrado = window.listaProductosGlobal.find(p => (p._id || p.id) === id);

    if (!productoEncontrado) {
        console.error("No se encontró el producto con ID:", id);
        return;
    }

    // 🌟 VALIDACIÓN DE STOCK (Seguridad en lógica)
    if (productoEncontrado.stock <= 0) {
        alert(`Lo sentimos, "${productoEncontrado.nombre}" ya no tiene stock disponible.`);
        return;
    }

    const contador = document.getElementById(`cantidad-${id}`);
    const cantidadSeleccionada = contador ? parseInt(contador.innerText) : 1;

    // 🌟 VALIDACIÓN DE CANTIDAD VS STOCK
    if (cantidadSeleccionada > productoEncontrado.stock) {
        alert(`No puedes agregar ${cantidadSeleccionada} unidad(es). Solo quedan ${productoEncontrado.stock} disponibles.`);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificamos si ya existe el producto en el carrito
    const idProducto = productoEncontrado._id || productoEncontrado.id;
    const productoExistente = cart.find(p => (p._id || p.id) === idProducto);

    // 🌟 NUEVA VALIDACIÓN: Si ya estaba en el carrito, que la suma total no supere el stock
    const cantidadActualEnCarrito = productoExistente ? productoExistente.cantidad : 0;
    if ((cantidadActualEnCarrito + cantidadSeleccionada) > productoEncontrado.stock) {
        alert(`No puedes agregar esa cantidad. Ya tienes ${cantidadActualEnCarrito} en el carrito y el stock total es de ${productoEncontrado.stock}.`);
        return;
    }

    if (productoExistente) {
        productoExistente.cantidad += cantidadSeleccionada;
    } else {
        cart.push({ ...productoEncontrado, cantidad: cantidadSeleccionada });
    }

    localStorage.setItem('carrito', JSON.stringify(cart));
    alert(`¡Éxito! Se agregaron ${cantidadSeleccionada} unidad(es) de "${productoEncontrado.nombre}" al carrito.`);
    
    // Reseteamos el contador visual
    if (contador) contador.innerText = "1";
};

// --- MANEJO DE SESIÓN ---
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