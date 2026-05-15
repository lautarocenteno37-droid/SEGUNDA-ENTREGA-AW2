export const createOrderItem = (pedido) => {
    return `
    <div class="w-5/6 bg-transparent border-2 border-gray-900 rounded-xl p-5 my-2 mx-auto text-gray-300">
        <div class="grid grid-cols-3 items-center">
            <div class="col-span-3 md:col-span-2">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-[10px] font-bold bg-gray-800 text-rose-500 px-2 py-1 rounded border border-gray-700 uppercase">
                        ORDEN #${pedido.id_pedido}
                    </span>
                    <p class="text-xs font-semibold text-gray-500">${pedido.fecha}</p>
                </div>
                <h4 class="text-lg font-bold text-gray-100">${pedido.descripcion}</h4>
                
                <div class="mt-3 space-y-1">
                    <p class="text-sm text-gray-400">
                        <span class="font-bold text-gray-600 uppercase text-[10px] tracking-widest">Dirección:</span> 
                        ${pedido.direccion}
                    </p>
                    <p class="text-sm text-gray-400">
                        <span class="font-bold text-gray-600 uppercase text-[10px] tracking-widest">Cantidad:</span> 
                        ${pedido.cantidad} unidades
                    </p>
                </div>
            </div>

            <div class="col-span-3 md:col-span-1">
                <div class="flex flex-col justify-start mt-4 md:items-end md:mt-0">
                    <p class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Total Pagado</p>
                    <span class="text-2xl font-black text-rose-500">$${Number(pedido.total).toLocaleString()}</span>
                    
                    <div class="mt-3 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-[10px] font-bold uppercase tracking-tighter">Procesado</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};