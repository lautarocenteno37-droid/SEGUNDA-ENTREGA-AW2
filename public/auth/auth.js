import { addSession } from '../utils/sessionstorage.controller.js';

// --- SELECTORES ---
const btnLogin = document.getElementById('btnLogin');

const auth = async ({ name, pass }) => {
    const user = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "email": name, "contraseña": pass })
    }).then(res => {
        if (!res.ok) {
            throw new Error('Error al iniciar sesión');
        }
        return res.json();
    }).catch(error => {
        console.log("Error:", error);
        throw new Error('Error en la peticion');
    });
    return user;
};

if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const name = document.getElementById('txtName').value;
        const pass = document.getElementById('txtPass').value;

        if (name !== '' && pass !== '') {
            try {
                const user = await auth({ name, pass });
                addSession(user);
                
                // Redirige al Home (index.html dentro de pages/home/)
                window.location.href = './pages/home/index.html'; 
            } catch (error) {
                alert("no se encontró el usuario");
            }
        } else {
            alert('Por favor, complete todos los campos');
        }
    });
}