export const addSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));

}

// utils/sessionstorage.controller.js

export const getSession = (key) => {
    const data = sessionStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
};
