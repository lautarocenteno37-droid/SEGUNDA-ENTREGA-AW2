import { addSession } from '../../utils/sessionstorage.controller.js';

const formRegister = document.getElementById('formRegister');

const register = async ({ nombre, apellido, email, contraseña, direccion, telefono }) => {
    

    const user = await fetch('http://localhost:3000/users/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            nombre,
            apellido,
            email,
            contraseña,
            direccion,
            telefono
        })
    }).then(res => {
        if (!res.ok) {
            throw new Error('Error al registrar el usuario');
        }
        return res.json();
    }).catch(error => {
        console.error("Error en la petición:", error);
        throw new Error('Error en la petición de registro');
    });
    
    return user;
};

if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault(); 


        const nombre = document.getElementById('regName').value.trim();
        const apellido = document.getElementById('regLastName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const telefono = document.getElementById('regPhone').value.trim();
        const direccion = document.getElementById('regAddress').value.trim();
        const contraseña = document.getElementById('regPass').value;


        if (nombre && apellido && email && telefono && direccion && contraseña) {
            try {

                const newUser = await register({ 
                    nombre, 
                    apellido, 
                    email, 
                    contraseña, 
                    direccion, 
                    telefono 
                });
                
                alert(`¡Registro exitoso!\nBienvenido ${newUser.nombre}. Ya puedes navegar.`);
                

                addSession(newUser);
                

                window.location.href = './index.html';
            } catch (error) {
                alert("No se pudo crear el usuario o el correo ya existe.");
            }
        } else {
            alert('Por favor, complete todos los campos del registro');
        }
    });
}