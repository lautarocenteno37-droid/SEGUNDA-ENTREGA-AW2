import { readFile } from 'fs/promises';

const fileuser = await readFile('./data/users.json', 'utf-8');
const users = JSON.parse(fileuser);

export const get_user_byid = (id) => { 
    return users.find(u => u.id === id);
}