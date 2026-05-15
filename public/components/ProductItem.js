export const createProductItem = (product) => {
    return `
    <div class="w-5/6 bg-transparent border-2 border-gray-900 rounded-xl p-5 my-2">
        <div class="grid grid-cols-3 items-center">
            <div class="col-span-3 md:col-span-2">
                <h1 class="text-xl font-bold text-rose-500 mb-1 tracking-tighter">#00${product.id} — ${product.marca}</h1>
                <h4 class="text-xl font-black text-gray-100">${product.nombre}</h4>
                <p class="text-sm font-medium text-gray-400 mt-2 pr-4">${product.descripcion}</p>
            </div>

            <div class="col-span-3 md:col-span-1">
                <div class="flex flex-col justify-start mt-4 md:items-end md:mt-0">
                    <span class="text-2xl font-black text-gray-100 mb-3">$${Number(product.precio).toLocaleString()}</span>
                    
                    <button 
                        onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                        class="bg-gray-900 border-2 border-gray-700 text-gray-200 p-3 rounded-2xl hover:bg-gray-700 transition-all active:scale-95 flex items-center gap-3 group">
                        <img src="../../assets/cart.svg" width="20" height="20"  class="filter brightness-200 group-hover:scale-110 transition-transform">
                        <span class="text-xs font-bold uppercase tracking-widest group-hover:scale-110 transition-transform mr-8">Añadir</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
};