const Chat = require('../models/Chat.Model')
const ChatPublic = require('../models/ChatPublic.Model')
const mongoose = require('mongoose')

class ChatController{
    async getPrivateChat(req, res){
        const { id } = req.decoded
        const { to } = req.query

        if(!mongoose.Types.ObjectId.isValid(to))
            return res.json({success: false, msg: 'Not found userID!'})
        else{
            await Chat.find({
                $or: [
                    {
                        from: id,
                        to,
                    },
                    {
                        from: to,
                        to: id
                    }
                ]
            }).then(response=>{
                if (!response)
                    return res.json({success: true, data: []})
                else{
                    return res.json({success: true, data: response})
                }
            })
        }
    }
    async getPublicChat(req, res){
        await ChatPublic.find()
            .populate('from', 'name avatar')
            .then(response=>{
            if (!response)
                return res.json({success: true, data: []})
            else{
                return res.json({success: true, data: response})
            }
        })
    }
}
module.exports = new ChatController