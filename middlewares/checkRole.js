const jwt = require('jsonwebtoken')

module.exports = function (allowedRoles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" });
            }

            // Пример дешифровки токена
            const decodedToken = Buffer.from(token, 'base64').toString();
            const [email, role] = decodedToken.split(':'); // Извлекаем email и роль из токена

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({ message: "Нет доступа" });
            }

            req.user = { email, role }; // Передаём email и роль в req
            next();
        } catch (e) {
            console.error(e);
            res.status(401).json({ message: "Не авторизован" });
        }
    };
};