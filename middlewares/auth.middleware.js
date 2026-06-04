import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {

        const secretoJWT = process.env.JWT_SECRET || 'ClaveSecretaDeRespaldoPorSiFallaElEnv';
        
        const decoded = jwt.verify(token, secretoJWT);
        req.usuarioLogueado = decoded; 
        
        next(); 
    } catch (error) {
        console.error("❌ ERROR AL VERIFICAR JWT EN COMPRA:", error.message);
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
    
};

export const verificarAdmin = (req, res, next) => {
    // Primero pasa por verificarToken que inyecta 'req.usuarioLogueado'
    if (req.usuarioLogueado && req.usuarioLogueado.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
};