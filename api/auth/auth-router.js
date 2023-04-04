const express = require('express')

const router = express.Roouter()


router.post('/register', async (req, res, next) => {
    res.json({ message: 'register router working' })
})


router.post('/login', async (req, res, next) => {
    res.json({ message: 'login router working' })
})


router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout router working' })
})


module.exports = router