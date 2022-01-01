const route = require('express').Router()
const Chat = require('../controllers/Chat.Controller')

route.get('/private', Chat.getPrivateChat)
route.get('/public', Chat.getPublicChat)

module.exports = route
