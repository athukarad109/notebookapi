const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {

    //Get user from jwt token and add its id in req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).json(({ error: "Authenticate with valid token" }))
    }

    try {
        const data = jwt.verify(token, "generalkenobi")
        req.user = data.user;
    } catch (error) {
        res.status(401).json(error)
    }

    next()
}

module.exports = fetchUser