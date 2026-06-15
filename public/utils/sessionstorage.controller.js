// Guarda el usuario en el sessionStorage bajo la clave 'user'
export const addSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

// Obtiene el usuario actual de la sesión
export const getSession = () => {
    const data = sessionStorage.getItem('user'); 
    if (!data) return null;
    return JSON.parse(data);
};

// Elimina la sesión actual 
export const removeSession = () => {
    sessionStorage.removeItem('user');
};

export const isLogged = () => {
    return sessionStorage.getItem('user') !== null;
};