const User = require('../models/User.Model')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

class UserController{
    async index(req, res){
        await User.find({}, 'name avatar').then(response=>{
            if (!response)
                return res.json({success: false, msg: 'Not found user!'})
            else{
                const list = []
                response.forEach(e => {
                    list.push({
                        name: e.name,
                        id: e._id,
                        avatar: e.avatar,
                    })
                })
                return res.json({
                    success: true,
                    data: list,
                })
            }
        })
        
    }
    
    async getID(req, res){
        const { id } = req.decoded
        await User.findById(id).then(response=>{
            if(!response)
                return res.json({success: false, msg: 'Cannot find id!'})
            else{
                return res.json({success: true, id, avatar: response.avatar, per: response.permission, name: response.name})
            }
        })
    }

    async changeProfile(req, res){
        const { id } = req.decoded
        const { name, avatar } = req.body
        await User.findByIdAndUpdate(id, {
            name,
            avatar
        }).then(response => {
            if(response !== null)
                return res.json({success: true, msg: 'Change Successful!'})
            else
                return res.json({success: false, msg: 'Change False!'})
        })
    }
    
    async changePass(req, res){
        const { id } = req.decoded
        const { oldPassword, newPassword } = req.body

        if(!oldPassword || oldPassword.length < 4)
            return res.json({success: false, msg: 'Error oldPassword!'})
        if(!newPassword || newPassword.length < 4)
            return res.json({success: false, msg: 'Error newPassword!'})
        let find = await User.findById(id)
        bcrypt.compare(oldPassword, find.password, async (err, success) => {
            if (success){
                await User.findByIdAndUpdate(id, {
                    password: await bcrypt.hash(newPassword, await bcrypt.genSalt(12))
                }).then(response => {
                    if(response !== null)
                        return res.json({success: true, msg: 'Change Successful!'})
                    else
                        return res.json({success: false, msg: 'Change False!'})
                })
            }else 
                return res.json({success: false, msg: 'Old Password does not match!'})
        })
        
    }
}
module.exports = new UserController