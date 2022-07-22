const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../models/User');

//creating user
router.post('/', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Name cannot be this short').isLength({ min: 3 }),
    body('password', 'Password cannot be this short').isLength({ min: 5 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then(user => res.json(user))
        .catch(e => res.json({ Error: e }))

})

module.exports = router