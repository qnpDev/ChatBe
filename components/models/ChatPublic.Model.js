const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    deleted: { type: Boolean, default: false},
}, {
    timestamps: true,
})

module.exports = mongoose.model('ChatPublic', chatSchema)