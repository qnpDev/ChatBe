const route = require('express').Router()
const User = require('../controllers/User.Controller')

route.get('/id', User.getID)
route.get('/all', User.index)
route.post('/password', User.changePass)
route.post('/profile', User.changeProfile)

module.exports = route
