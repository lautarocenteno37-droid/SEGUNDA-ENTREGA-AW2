import { addSession } from '../utils/sessionstorage.controller.js';

// --- SELECTORES ---
// Buscamos el formulario completo en lugar de solo el botón
const formLogin = document.getElementById('formLogin');

/**
 * Función para realizar la petición HTTP al Backend
 */
const auth = async ({ name, pass }) => {
    try {
        const res = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": name, "contraseña": pass })
        });

        // Si el estado no es exitoso (401, 500, etc.), leemos el error enviado por Express
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Error al iniciar sesión');
        }

        // Si todo está bien, retornamos el objeto del usuario (que incluye el _id de Mongo)
        return await res.json();

    } catch (error) {
        console.error("Error en auth:", error.message);
        throw error; // Reenviamos el error exacto al bloque del evento
    }
};

// --- EVENT LISTENER ---
if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('txtName').value.trim();
        const pass = document.getElementById('txtPass').value;

        if (name !== '' && pass !== '') {
            try {
                // 2. Ejecutamos la petición al backend
                const user = await auth({ name, pass });
                
                // 3. Guardamos los datos completos en el sessionStorage (incluyendo el rol y el token)
                addSession(user);
                
                // 4. REDIRECCIÓN SEGÚN EL ROL
                alert(`¡Bienvenido/a, ${user.nombre}!`);

                if (user.rol === 'admin') {
                    // Si es administrador, lo mandás a tu carpeta o vista de administración
                    window.location.href = './pages/admin/dashboard.html'; 
                } else {
                    // Si es cliente común (o default), va a la tienda tradicional
                    window.location.href = './pages/home/productos.html'; 
                }
                
            } catch (error) {
                alert(error.message); 
            }
        } else {
            alert('Por favor, complete todos los campos');
        }
    });
}
