const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Fallback for easy testing in development
        req.user = { id: 1, name: 'Guest User' };
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) {
            // Even if token is invalid, fallback to Guest in development
            req.user = { id: 1, name: 'Guest User' };
            return next();
        }
        req.user = user;
        next();
    });
};
