import { getSession } from '../../utils/sessionstorage.controller.js';

const token = localStorage.getItem('token'); 

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setTimeout(() => {
        if (typeof window.loadAllOrders === 'function') {
            window.loadAllOrders("");
        }
    }, 50);
    setupLogout(); 
});

// ==========================================
// 📦 CRUD DE PRODUCTOS
// ==========================================

const loadProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/productos');
        const data = await response.json();
        console.log(" Datos de productos recibidos del backend:", data);
        const tbody = document.getElementById('tabla-productos');
        if (!tbody) return;

        // 🌟 VALIDACIÓN SEGURA: Nos aseguramos de tener un array de productos
        let listaProductos = [];
        if (Array.isArray(data)) {
            listaProductos = data;
        } else if (data && typeof data === 'object') {
            listaProductos = data.productos || data.data || [];
        }

        if (listaProductos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="py-4 text-center text-gray-500">No hay productos en el catálogo.</td></tr>`;
            return;
        }

        tbody.innerHTML = listaProductos.map(p => `
            <tr class="border-b border-gray-900 hover:bg-gray-900/50 transition-all">
                <td class="py-3 px-4">
                    <div class="font-semibold text-gray-200">${p.nombre}</div>
                    <div class="text-xs text-gray-500 font-mono">${p.marca || 'Sin marca'} ${p.categoria ? `• ${p.categoria}` : ''}</div>
                </td>
                <td class="py-3 px-4 text-rose-400 font-bold">$${(p.precio || 0).toLocaleString('es-AR')}</td>
                
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                        <input type="number" id="input-stock-${p._id}" value="${p.stock || 0}" 
                            class="w-16 bg-gray-950 border border-gray-800 rounded px-2 py-1 text-center text-sm focus:outline-none focus:border-rose-500">
                        <button onclick="cambiarStockRapido('${p._id}')" 
                            class="bg-gray-800 hover:bg-emerald-700 text-gray-300 hover:text-white px-2 py-1 rounded text-xs transition-all font-medium">
                            Actualizar
                        </button>
                    </div>
                </td>

                <td class="py-3 px-4 flex justify-center gap-4 items-center">
                    <button onclick="prepararEditar('${p._id}', '${p.nombre}', '${p.marca || ''}', ${p.precio}, ${p.stock}, '${p.imagen || ''}', '${p.descripcion || ''}', '${p.categoria || ''}')" class="text-blue-400 hover:underline font-medium">Editar</button>
                    <button onclick="borrarProducto('${p._id}')" class="text-rose-500 hover:underline font-medium">Borrar</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error al cargar productos:", err);
    }
};

// Guardar (POST o PUT)
const form = document.getElementById('product-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const nombre = document.getElementById('prod-nombre').value;
        const marca = document.getElementById('prod-marca').value;
        const precio = document.getElementById('prod-precio').value;
        const stock = document.getElementById('prod-stock').value;
        const imagen = document.getElementById('prod-imagen').value;
        const descripcion = document.getElementById('prod-descripcion').value;
        const categoria = document.getElementById('prod-categoria').value;




        const url = id ? `http://localhost:3000/productos/${id}` : 'http://localhost:3000/productos';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, marca, precio, stock, imagen, descripcion, categoria })
            });

            if (res.ok) {
                resetForm();
                loadProducts();
            } else {
                alert('Error al guardar el producto.');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// Actualizar Stock de forma rápida (Usa tu ruta PATCH)
window.cambiarStockRapido = async (id) => {
    const nuevoStock = document.getElementById(`input-stock-${id}`).value;
    try {
        const res = await fetch(`http://localhost:3000/productos/updateStock/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: Number(nuevoStock) })
        });
        if (res.ok) {
            alert('Stock actualizado con éxito.');
            loadProducts();
        } else {
            alert('No se pudo actualizar el stock.');
        }
    } catch (err) {
        console.error("Error actualizando stock:", err);
    }
};

window.prepararEditar = (id, nombre, marca, precio, stock, imagen, descripcion, categoria) => {
    document.getElementById('product-id').value = id;
    document.getElementById('prod-nombre').value = nombre;
    document.getElementById('prod-marca').value = marca;
    document.getElementById('prod-precio').value = precio;
    document.getElementById('prod-stock').value = stock;
    document.getElementById('prod-imagen').value = imagen;
    document.getElementById('prod-descripcion').value = descripcion;
    document.getElementById('prod-categoria').value = categoria;
    document.getElementById('form-title').innerText = "Modificar Producto";
    document.getElementById('btn-guardar').innerText = "Actualizar";
    document.getElementById('btn-cancelar').classList.remove('hidden');
};

const resetForm = () => {
    if (form) form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').innerText = "Crear Nuevo Producto";
    document.getElementById('btn-guardar').innerText = "Guardar Producto";
    document.getElementById('btn-cancelar').classList.add('hidden');
};

const btnCancelar = document.getElementById('btn-cancelar');
if (btnCancelar) {
    btnCancelar.addEventListener('click', resetForm);
}

window.borrarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;
    try {
        const res = await fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' });
        if (res.ok) loadProducts();
    } catch (err) {
        console.error(err);
    }
};

// ==========================================
// 🛒 ÓRDENES GLOBALES
// ==========================================
window.loadAllOrders = async (categoriaFiltro = '') => {
    try {
        const url = categoriaFiltro 
            ? `http://localhost:3000/pedidos?categoria=${encodeURIComponent(categoriaFiltro)}`
            : 'http://localhost:3000/pedidos';

        const response = await fetch(url);
        const data = await response.json();
        
        const tbody = document.getElementById('tabla-ordenes');
        if (!tbody) return;

        let orders = [];
        if (Array.isArray(data)) {
            orders = data;
        } else if (data && typeof data === 'object') {
            orders = data.ventas || data.pedidos || data.data || [];
        }

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-gray-500 font-medium">No se encontraron órdenes en esta categoría.</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(order => {
            const cliente = order.usuario ? ( order.usuario.email || 'Usuario') : 'Desconocido';
            
            const articulos = order.productos && order.productos.length > 0
                ? order.productos.map(p => {
                    const nombreProd = p.producto && typeof p.producto === 'object' && p.producto.nombre 
                        ? p.producto.nombre 
                        : 'Producto';
                    return `${nombreProd} (x${p.cantidad || 1})`;
                  }).join(', ')
                : 'Sin especificar';
            
            return `
                <tr class="border-b border-gray-900 hover:bg-gray-900/30 transition-all text-gray-300">
                    <td class="py-3 px-4 font-mono text-xs text-gray-500">#${order._id ? order._id.substring(18) : '----'}</td>
                    <td class="py-3 px-4 font-semibold text-rose-400">${cliente}</td>
                    <td class="py-3 px-4 text-gray-400">${articulos}</td>
                    <td class="py-3 px-4 text-gray-500 text-xs">${order.direccion || 'No provista'}</td>
                    <td class="py-3 px-4 font-bold text-emerald-400">$${(order.total || 0).toLocaleString('es-AR')}</td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error("Error cargando órdenes:", err);
    }
};
// ==========================================
// 🚪 CERRAR SESIÓN (LOGOUT)
// ==========================================
const setupLogout = () => {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            console.log('Sesión finalizada con éxito.');
            window.location.href = '../../index.html'; 
        });
    }
};