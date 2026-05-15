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
        total += Number(product.precio);
        return `
        <div class="w-5/6 bg-transparent border-2 border-gray-900 rounded-xl p-5 flex justify-between items-center transition-all hover:border-gray-700">
            <div>
                <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">${product.marca}</p>
                <h4 class="text-lg font-bold text-gray-200">${product.nombre}</h4>
                <p class="text-sm text-gray-400">$${Number(product.precio).toLocaleString()}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="bg-transparent border-2 border-gray-800 p-2 rounded-xl hover:bg-gray-800 transition-colors group">
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

// Confirmar compra y guardar en pedidos.json
document.getElementById('btnFinalizar')?.addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Mapeo al formato de tu pedidos.json
    const nuevasOrdenes = cart.map(p => ({
        id_usuario: 3, // ID de ejemplo
        id_producto: p.id,
        descripcion: p.descripcion,
        fecha: new Date().toISOString().split('T')[0],
        total: Number(p.precio),
        direccion: "Presidente Milei 333", 
        cantidad: 1
    }));

    try {
        const res = await fetch('http://localhost:3000/pedidos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevasOrdenes)
        });

        if (res.ok) {
            localStorage.removeItem('carrito');
            window.location.href = './ordenes.html';
        }
    } catch (e) {
        console.error("Error al procesar compra", e);
    }
});

document.addEventListener('DOMContentLoaded', renderCart);