export const getPost = async () => {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los posts');
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        return [];
    }
};

export const addPost = async (postData) => {
    try {
        const response = await fetch('http://localhost:3000/posts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error('Error al agregar el post');
        }
    } catch (error) {
        console.error('Error al agregar el post:', error);
    }
};

export const likePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/like/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al agregar el like');
        }
    } catch (error) {
        console.error('Error al agregar el like:', error);
    }
};

export const dislikePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/dislike/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'            }
        });
        if (!response.ok) {
            throw new Error('Error al agregar el dislike');
        }
    } catch (error) {
        console.error('Error al agregar el dislike:', error);
    }
            }



export const deletePost = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el post');
        }
    } catch (error) {
        console.error('Error al eliminar el post:', error);
    }
};