const express = require('express');

const router = express.Router();

const User = require('../models/User');

//creating user
router.post('/', (req, res) => {
    const user = User(req.body);
    user.save();
    res.send(user);
    console.log("Success")
})

module.exports = router