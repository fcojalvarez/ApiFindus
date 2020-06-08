const JWT_PASSWORD = "finduskeysecret";
const jwt = require("jsonwebtoken");

function onlyAdmins() {
    return (req, res, next) => {
        if (!req.token) {
            res.status(401).json({ message: "Necesitas un token JWT" });
            return;
        }

        try {
            let token = req.token;
            let user = jwt.verify(token, JWT_PASSWORD);
            req.user = user;
        } catch (err) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }

        if (req.user.profile !== 'admin') {
            res.status(401).json({ message: "Necesitas permisos de administrador" });
            return;
        }
        next();
    };
}

module.exports = onlyAdmins;