const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Si no hay token, respondemos de una vez para no dejar al cliente esperando
    return res.status(401).json({ error: "No se proporcionó un token válido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); // Si todo está bien, pasamos a la ruta
  } catch (err) {
    // Si el token falla, lo mandamos al errorHandler
    err.status = 403;
    next(err); 
  }
};

module.exports = authMiddleware;