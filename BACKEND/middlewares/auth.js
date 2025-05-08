
function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (auth === "Bearer tu_token") { // reemplaza por un token real si usas JWT o sesión
      next();
    } else {
      res.status(401).send("No autorizado");
    }
  }
  
  module.exports = { requireAuth };
  