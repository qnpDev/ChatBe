const route = require('express').Router()
const Auth = require('../controllers/Auth.Controller')

route.post('/login', Auth.login)
route.post('/logout', Auth.logout)
route.post('/signup', Auth.signup)
route.post('/token', Auth.token)

module.exports = route
