require('./config')
const bcrypt = require('bcryptjs')

//User
const User = require('./User.Model')
const createUser = async () => {
    if((await User.countDocuments()) == 0)
        new User({
            permission: 10,
            username: process.env.ADMIN_USERNAME,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, await bcrypt.genSalt(12)),
            name: 'Nguyễn Phú Quí',
        }).save()
}
createUser()

