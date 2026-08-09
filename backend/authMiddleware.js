const jwtt = require('jsonwebtoken');

const SECRET = 'minha_chave_secreta_temporaria';

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];


    if(!authHeader){
        return res.status(401).json({erro: 'Token não fornecido'});
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({erro: 'Token mal formatado'});
    }

    try{
        const decoded = jwtt.verify(token, SECRET);
        console.log('Token decodificado:', decoded);
        req.userId = decoded.userId;
        console.log('req.userId logo após atribuir:', req.userId); // <-- nova linha
        next();
    } catch (error){
        return removeEventListener.status(401).jason({erro: 'Token inválido ou expirado'});
    }
}
module.exports = authMiddleware;