export const createNavbar = () => {
    return `
    <nav class="bg-gray-300 border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex-shrink-0 flex items-center">
                    <span class="text-2xl font-black text-slate-900 tracking-tighter">SHOP<span class="text-blue-600">.</span></span>
                </div>

                <div class="hidden md:flex space-x-8">
                    <a href="index.html" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Inicio</a>
                    <a href="productos.html" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Productos</a>
                    <a href="categorias.html" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Categorías</a>
                </div>

                <div class="flex items-center space-x-4">
                    <a href="carrito.html" class="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span id="cart-count" class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                    </a>
                    
                    <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2">
            <a href="index.html" class="block py-2 text-slate-600 font-medium">Inicio</a>
            <a href="productos.html" class="block py-2 text-slate-600 font-medium">Productos</a>
            <a href="categorias.html" class="block py-2 text-slate-600 font-medium">Categorías</a>
        </div>
    </nav>
    `;
};

// Función para inicializar la lógica del navbar (clics)
export const initNavbar = () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
};