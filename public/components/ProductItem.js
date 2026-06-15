export const createProductItem = (product) => {
    const prodId = product._id || product.id;
    const tieneStock = product.stock > 0;
    const rutaImagen = product.imagen 
        ? `../../assets/${product.imagen}` 
        : '../../assets/placeholder.jpg';

    return `
    <div class="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl p-4 my-4 mx-auto flex flex-col justify-between overflow-hidden">  
            <div class="w-full h-48 bg-gray-900 rounded-xl mb-4 overflow-hidden">
            <img src="${rutaImagen}" 
                 alt="${product.nombre}" 
                 class="w-full h-full object-cover"
                 onerror="this.src='../../assets/placeholder.jpg'"> 
        </div>
        <div class="px-2 mb-4">
            <h1 class="text-xl font-bold ${tieneStock ? 'text-rose-500' : 'text-gray-600'} uppercase truncate">${product.nombre}</h1>
            <h4 class="text-lg font-black text-gray-100">${product.marca}</h4>
            <h4 class="text-sm font-bold text-gray-400 mt-2">${product.stock} en stock</h4>
        </div>

        <div class="mt-auto px-2">
            <div class="flex justify-between items-end mb-4">
                <span class="text-2xl font-black text-gray-100">$${Number(product.precio).toLocaleString()}</span>
            </div>
            
            <div class="h-12 flex items-center justify-between">
                ${tieneStock ? `
                    <div class="flex items-center gap-2">
                        <button onclick="cambiarCantidad('${prodId}', -1)" class="w-8 h-8 bg-gray-900 border border-gray-700 text-white rounded-lg">-</button>
                        <span id="cantidad-${prodId}" class="w-8 text-center font-bold text-white">1</span>
                        <button onclick="cambiarCantidad('${prodId}', 1)" class="w-8 h-8 bg-gray-900 border border-gray-700 text-white rounded-lg">+</button>
                    </div>
                    <button onclick="agregarAlCarritoConCantidad('${prodId}')" class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold transition-all">Añadir</button>
                ` : `
                    <button disabled class="w-full bg-gray-900 border border-gray-800 text-gray-600 py-2 rounded-xl font-bold cursor-not-allowed">Agotado</button>
                `}
            </div>
        </div>
    </div>
    `;
};