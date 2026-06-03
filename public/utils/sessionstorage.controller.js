// Guarda el usuario en el sessionStorage bajo la clave 'user'
export const addSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

// Obtiene el usuario actual de la sesión
export const getSession = () => {
    const data = sessionStorage.getItem('user'); // Usamos 'user' directo para no depender de parámetros
    if (!data) return null;
    return JSON.parse(data);
};

// Elimina la sesión actual (Ideal para un botón de "Cerrar Sesión")
export const removeSession = () => {
    sessionStorage.removeItem('user');
};

// Comprueba de forma rápida si el usuario está logueado (devuelve true o false)
export const isLogged = () => {
    return sessionStorage.getItem('user') !== null;
};