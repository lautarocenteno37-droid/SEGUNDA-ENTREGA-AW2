import { getSession } from '../../utils/sessionstorage.controller.js';

const txtSaludo = document.getElementById('txtSaludo');
const user = getSession("user");

txtSaludo.textContent = `Hola, ${user.nombre} ${user.apellido}`;
