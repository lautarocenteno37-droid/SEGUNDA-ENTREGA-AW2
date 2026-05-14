import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';

const router = Router();

// Función auxiliar para leer datos de cualquier archivo JSON
const getData = async (fileName) => {
    try {
        const fileData = await readFile(`./data/${fileName}`, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error(`Error leyendo ${fileName}:`, error);
        return [];
    }
};

// Obtener todos los posts
router.get('/', async (req, res) => {
    const postsData = await getData('posts.json');
    if (postsData.length > 0 || Array.isArray(postsData)) {
        res.status(200).json(postsData);
    } else {
        res.status(400).json({ status: false, message: "No se pudieron obtener los posts" });
    }
});

// Agregar un nuevo post
router.post('/add', async (req, res) => {
    try {
        const data = req.body; // Se espera que venga el 'author' (email o nombre) y el 'text'
        const postsData = await getData('posts.json');
        
        // Configuración de campos iniciales
        data.likes = 0;
        data.dislikes = 0;
        // Generación de ID incremental
        data.id = postsData.length > 0 ? postsData[postsData.length - 1].id + 1 : 1;
        console.log("Nuevo post recibido:", data);
        postsData.push(data);

        await writeFile('./data/posts.json', JSON.stringify(postsData, null, 2));
        res.status(201).json({ message: 'Post creado con éxito', post: data });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el post' });
    }
});

// Dar like a un post por ID
router.put('/like/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const postsData = await getData('posts.json');
    
    try {
        const index = postsData.findIndex(e => e.id === id);
        
        if (index > -1) {
            postsData[index].likes++;
            await writeFile('./data/posts.json', JSON.stringify(postsData, null, 2));
            res.status(200).json({ message: 'Like agregado', likes: postsData[index].likes });
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al procesar el like' });
    }
});

router.put('/dislike/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const postsData = await getData('posts.json');
    
    try {
        const index = postsData.findIndex(e => e.id === id);
        
        if (index > -1) {
            postsData[index].dislikes++;
            await writeFile('./data/posts.json', JSON.stringify(postsData, null, 2));
            res.status(200).json({ message: 'Dislike agregado', dislikes: postsData[index].dislikes });
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al procesar el dislike' });
    }
});

// Eliminar un post por ID
router.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const postsData = await getData('posts.json');
    
    try {
        const index = postsData.findIndex(e => e.id === id);
        
        if (index > -1) {
            postsData.splice(index, 1);
            await writeFile('./data/posts.json', JSON.stringify(postsData, null, 2));
            res.status(200).json({ message: 'Post eliminado', posts: postsData });
        } else {
            res.status(404).json({ message: 'Post no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
});

export default router;