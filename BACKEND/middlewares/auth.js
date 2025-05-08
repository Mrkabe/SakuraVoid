
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET = 'tu_clave_secreta'; // usa .env

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).send("No autorizado");

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send("Usuario no encontrado");

    req.user = user; // lo pasamos al request
    next();
  } catch (err) {
    return res.status(401).send("Token inválido o expirado");
  }
}

module.exports = { requireAuth };
