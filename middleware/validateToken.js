const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {

    const token = req.header('auth-token');

    if (!token) {

        res.status(401).send({ error: "Please authenticate using a valid token" });

    }

    try {

        const data = jwt.verify(token, JWT_SECRET);
        next();

    } catch (error) {

        res.status(401).send({ error: "Please authenticate using a valid token" });

    }

}

module.exports = validateToken;