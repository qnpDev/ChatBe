const CheckAuth = require('../middleware/AuthToken')
const Auth = require('./Auth.Route')
const User = require('./User.Route')
const Chat = require('./Chat.Route')

const route = app => {

    app.use('/auth', Auth)
    app.use('/user', CheckAuth, User)
    app.use('/chat', CheckAuth, Chat)

}
module.exports = route