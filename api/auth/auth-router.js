const express = require('express')

const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../users/users-model')


router.post('/register', async (req, res, next) => {

    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8)
        //    ^^^^ you hash the password like this
        //the first argument of 'hashSync' is what you 
        //want hashed. The number after is how 
        //many times you want it hashed. 
        const newUser = { username, password: hash }
        const result = await User.add(newUser)
        res.status(201).json({
            message: `nice to have you, ${result.username}`,
            data: {}
        })
    } catch (err) {
        next(err)
    }
})


router.post('/login', async (req, res, next) => {
    res.json({ message: 'login router working' })
})


router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout router working' })
})


module.exports = router