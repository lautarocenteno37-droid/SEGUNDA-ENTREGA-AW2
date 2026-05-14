import { getSession } from "../../utils/sessionstorage.controller.js";
import { Post } from "../../components/post.js";
import { getPost, addPost, likePost, deletePost, dislikePost } from "../../posts/post.js";

const user = getSession('user');

const btnAdd = document.getElementById('btnAdd');
const postContainer = document.getElementById('postContainer');

const renderPost = async () => {
    const posts = await getPost();
    const postContainer = document.getElementById('postContainer');
    let postsContent = '';
    postContainer.innerHTML = postsContent;

    posts.forEach(e => {
        postsContent += Post(e, user.nombre);
    });
    postContainer.innerHTML = postsContent;
    
};

document.addEventListener("DOMContentLoaded", async () => {
    await renderPost();
});

btnAdd.addEventListener('click', async () => {
    const textArea = document.getElementById("textArea").value;
    
    const newPost = {
        author: user.nombre,
        text: textArea
    };
    if (!textArea.trim()) {
        alert('El texto del post no puede estar vacío');
        return;
    }
    await addPost(newPost);
    await renderPost();
    // Limpiar el textarea después de publicar
    document.getElementById("textArea").value = '';
});

postContainer.addEventListener('click', async (e) => {
    const clickedElement = e.target;
    const id = clickedElement.getAttribute('data-id');

    if (clickedElement.name === 'btnLike') {
        await likePost(id);
        await renderPost();
    } else if (clickedElement.name === 'btnDelete') {
        await deletePost(id);
        await renderPost();
    }else if (clickedElement.name === 'btnDislike') {
        await dislikePost(id);
        await renderPost();
    }
});