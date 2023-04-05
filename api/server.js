const path = require('path')
const express = require('express')
const session = require('express-session')

const Store = require('connect-session-knex')(session)
//^^ gives us access to perissting the db

const authRouter = require('./auth/auth-router.js')
const usersRouter = require('./users/users-router.js')


const server = express()


server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())
server.use(session({
  name: 'monkey', 
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 *60, //<< this is in milli seconds
    //so it needs to be a pretty big number
    secure: false, //<<< if this was true it would only work on https
    httpOnly: false, //<<< the js on the page CAN read the cookie
  },
  rolling: true, //<<< so we get a fresh coookie with every login
  resave: false, //<<< don't worry about this right now just set it to false
  saveUninitialized: false, // <<< this means we can't be setting cookies
  // on any client that makes requests. We can only set a cookie on 
  //successful login
  store: new Store({
    knex: require('../database/db-config.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    cleanInterval: 1000 * 60 * 60,
  })
}))

server.use('/api/auth', authRouter)

server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
