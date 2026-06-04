export const createProductItem = (product) => {
    const prodId = product._id || product.id;
    const tieneStock = product.stock > 0; // 🌟 Bandera de control

    return `
    <div class="w-5/6 bg-transparent border-2 ${tieneStock ? 'border-gray-900' : 'border-gray-900/50'} rounded-xl p-5 my-2 mx-auto transition-all">
        <div class="grid grid-cols-3 items-center">
            <div class="col-span-3 md:col-span-2">
                <h1 class="text-xl font-bold ${tieneStock ? 'text-rose-500' : 'text-gray-600'} mb-1 uppercase">${product.nombre}</h1>
                <h4 class="text-xl font-black text-gray-100">${product.marca}</h4>
                <p class="text-sm font-medium text-gray-400 mt-2">${product.descripcion}</p>
                <h5 class="text-sm font-mono mt-1 ${tieneStock ? 'text-gray-500' : 'text-red-500 font-bold'}">
                    ${tieneStock ? `Stock: ${product.stock}` : 'SIN STOCK DISPONIBLE'}
                </h5>
            </div>

            <div class="col-span-3 md:col-span-1">
                <div class="flex flex-col md:items-end mt-4 md:mt-0">
                    <span class="text-2xl font-black text-gray-100 mb-3">$${Number(product.precio).toLocaleString()}</span>
                    
                    ${tieneStock ? `
                        <div class="flex items-center gap-3 mb-4">
                            <button onclick="cambiarCantidad('${prodId}', -1)" class="w-8 h-8 bg-gray-900 border border-gray-700 text-white rounded-lg">-</button>
                            <span id="cantidad-${prodId}" class="font-bold text-lg text-white">1</span>
                            <button onclick="cambiarCantidad('${prodId}', 1)" class="w-8 h-8 bg-gray-900 border border-gray-700 text-white rounded-lg">+</button>
                        </div>
                        <button onclick="agregarAlCarritoConCantidad('${prodId}')" class="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-2xl w-full font-bold uppercase text-xs">
                            Añadir
                        </button>
                    ` : `
                        <button disabled class="bg-gray-800 text-gray-500 p-3 rounded-2xl w-full font-bold uppercase text-xs cursor-not-allowed border border-gray-700">
                            Agotado
                        </button>
                    `}
                </div>
            </div>
        </div>
    </div>
    `;
};