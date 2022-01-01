const mongoose = require('mongoose')
require('dotenv').config()

const userSchema = mongoose.Schema({
    permission: {type: Number, default: 0},
    username: {
        type: String,
        lowercase: true,
        trim: true,
    },
    password: String,
    name: String,
    avatar: {type: String, default: process.env.DEFAULT_AVATAR},
    refreshToken: [String],
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)