export const createProductCard = (product) => {
    return `
        <div class="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="aspect-square w-full overflow-hidden bg-gray-200">
                <img src="${product.imagen}" alt="${product.nombre}" 
                     class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300">
            </div>
            
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-blue-600">${product.marca}</p>
                        <h3 class="mt-1 text-lg font-bold text-slate-800">${product.nombre}</h3>
                    </div>
                    <p class="text-lg font-black text-slate-900">$${Number(product.precio).toLocaleString()}</p>
                </div>
                
                <p class="mt-2 text-sm text-slate-600 line-clamp-2">${product.descripcion}</p>
                
                <button class="mt-4 w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 active:scale-[0.98] transition-all">
                    Añadir al carrito
                </button>
            </div>
        </div>
    `;
};