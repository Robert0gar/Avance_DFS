const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("Rol del usuario:", req.user.role);
        console.log("Roles permitidos:", allowedRoles);

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Acceso denegado. Tu rol no tiene permisos para esta acción." 
            });
        }
        next();
    };
};

module.exports = authorizeRoles;