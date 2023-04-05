const express = require('express')

const bcryptjs = require('bcryptjs')

const router = express.Router()

const User = require('../users/users-model')


router.post('/register', async (req, res, next) => {

    try {
        const { username, password } = req.body
        const hash = bcryptjs.hashSync(password, 8)
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
    try {
        const { username, password } = req.body //<<< we are getting
        //the username from the request body
        const [user] = await User.findBy({ username }) //<<< then here
        //we are taking a trip to the db to check if this particulr user 
        //is in the database. the square brackets just mean it is 
        //accepting the first one

        if (user && bcryptjs.compareSync(password, user.password))//<< this is
        //saying if the user and the bycrpty.js password matches the 
        //one stored then start a session for the user.
        { 


            req.session.user = user //<< this is starting a session server side
            //^^ this is a very important line
            //it means, that a session needs to be saved for this user
            //and a cookie needs to be set on the browser

            res.json({ message: `welcome back, ${user.username}`})
        } else {
            next({ status: 401, message: 'bad credentials' })
        }
        

    } catch (err) {
        next(err)
    }
})


router.get('/logout', async (req, res, next) => {
    if (req.session.user) { //<< if there is a session we can destroy it
        const { username } = req.session.user
        req.session.destroy(err => {
            if (err) {
                res.json({ message: `you can never leave, ${username}` })
            } else {
                res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00')
                res.json({ message: `Goodbye, ${username}` })
            }
        })
    } else { //<< if no ression nothing to destroy
        res.json({
            message: 'sorry, have we met?'
        })
    }
})


module.exports = router