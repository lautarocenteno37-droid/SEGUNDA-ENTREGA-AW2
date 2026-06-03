import { getSession } from '../../utils/sessionstorage.controller.js';

const cartContainer = document.getElementById('cartContainer');
const totalPriceElem = document.getElementById('totalPrice');
const cartFooter = document.getElementById('cartFooter');

// Función para renderizar los productos guardados
const renderCart = () => {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-20">
                <p class="italic text-gray-500 text-lg">Tu carrito está vacío...</p>
                <a href="./productos.html" class="text-rose-500 font-bold underline mt-4 block uppercase text-xs tracking-widest">Ir a comprar</a>
            </div>
        `;
        cartFooter?.classList.add('hidden');
        return;
    }

    cartFooter?.classList.remove('hidden');
    let total = 0;

    cartContainer.innerHTML = cart.map((product, index) => {
        // Multiplica el precio por la cantidad (por si el frontend agrupa unidades)
        const cantidad = product.cantidad || 1;
        total += Number(product.precio) * cantidad;

        return `
        <div class="w-5/6 bg-transparent border-2 border-gray-900 rounded-xl p-5 flex justify-between items-center transition-all hover:border-gray-700 mx-auto my-2 text-gray-300">
            <div>
                <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">${product.marca || 'Marca'}</p>
                <h4 class="text-lg font-bold text-gray-200">${product.nombre}</h4>
                <p class="text-sm text-gray-400">
                    $${Number(product.precio).toLocaleString()} ${cantidad > 1 ? `x ${cantidad} u.` : ''}
                </p>
            </div>
            <button onclick="removeFromCart(${index})" class="bg-transparent border-2 border-gray-800 p-2 rounded-xl hover:bg-gray-800 transition-colors group cursor-pointer">
                <img src="../../assets/trash.svg" width="20" height="20" class="opacity-50 group-hover:opacity-100 invert">
            </button>
        </div>
        `;
    }).join('');

    if (totalPriceElem) totalPriceElem.innerText = `$${total.toLocaleString()}`;
};

// Eliminar un producto
window.removeFromCart = (index) => {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    cart.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderCart();
};

// Confirmar compra y guardar en MongoDB mediante la API
document.getElementById('btnFinalizar')?.addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Obtenemos el usuario de la sesión activa
    const usuarioLogueado = getSession();

    if (!usuarioLogueado) {
        alert("Debes iniciar sesión para finalizar la compra");
        window.location.href = '../../index.html'; 
        return;
    }


    const nuevasOrdenes = cart.map(p => ({

        usuario: usuarioLogueado._id, 
        _id: p._id || p.id_producto,
        descripcion: p.descripcion,
        precio: Number(p.precio),
        cantidad: p.cantidad || 1,
        direccion: usuarioLogueado.direccion,
        fecha: new Date().toISOString().split('T')[0]
    }));
    try {
        const res = await fetch('http://localhost:3000/pedidos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevasOrdenes)
        });

        if (res.ok) {
            localStorage.removeItem('carrito'); // Limpiamos el almacenamiento local
            alert("¡Compra procesada con éxito!");
            window.location.href = './ordenes.html'; // Redirección al historial
        } else {
            const errData = await res.json();
            alert(`Error al procesar el pedido: ${errData.error}`);
        }
    } catch (e) {
        console.error("Error al procesar compra", e);
        alert("Hubo un error de conexión con el servidor.");
    }
});

document.addEventListener('DOMContentLoaded', renderCart);