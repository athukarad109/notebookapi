const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');

const JWTSECRET = "generalkenobi"

//creating user
router.post('/createuser', [
    //validating
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Name cannot be this short').isLength({ min: 3 }),
    body('password', 'Password cannot be this short').isLength({ min: 5 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let testUser = await User.findOne({ email: req.body.email });
        if (testUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWTSECRET)

        res.json({ authToken })

    } catch (e) {
        res.status(500).send("Something went wrong")
    }
})

//authenticating a user - login

router.post('/login', [
        //validating
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists()
    ],

    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ error: "Incorrect username or password" })
            }

            const passtocompare = await bcrypt.compare(password, user.password);

            if (!passtocompare) {
                return res.status(400).json({ error: "Incorrect username or password" })
            }

            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWTSECRET)
            res.send(authToken)

        } catch (e) {
            res.status(500).send("Something went wrong")
        }

    })

module.exports = router