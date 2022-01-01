const User = require('../models/User.Model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Auth{
    async login(req, res) {
        const { username, password } = req.body
        
        if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null){
            return res.json({success: false, msg: 'Username must two characters at least and have no special characters!'})
        }

        const find = await User.findOne({
            username: username.toLowerCase(),
        })

        if (find === null)
            return res.json({success: false, msg: 'Invalid username or password!'})
        else{
            bcrypt.compare(password, find.password, async (err, success) => {
                if (success){
                    const user = {
                        username: find.username,
                        per: find.permission,
                        id: find._id
                    }
                    const token = jwt.sign(user, process.env.TOKEN_SECRET, {
                        expiresIn: 60 * 5
                    })
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
                        expiresIn: 60 * 60 * 24 * 30
                    })
                    await User.findOneAndUpdate({
                        username: username.toLowerCase(),
                        }, {
                            $push: {
                                refreshToken: refreshToken,
                            }
                    })
                    return res.json({success: true, token: token, refreshToken: refreshToken})
                }else 
                    return  res.json({success: false, msg: 'Invalid username or password!'})
            })
        }
    }

    async signup(req, res){
        const { username, password, name} = req.body

        if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null){
            return res.json({success: false, msg: 'Username must two characters at least and have no special characters!'})
        }
        if(!password || password.length < 4)
            return res.json({success: false, msg: 'Password at least 4 character!'})
        if(!name || name.length === 0)
            return res.json({success: false, msg: 'Name at least 1 character!'})
        const count = await User.countDocuments({ username: username.toLowerCase() })
        if (count > 0)
            return res.json({success: false, msg: 'Username already exists!'})
        else{
            const save = await new User({
                name,
                permission: 0,
                username: username.toLowerCase(),
                password: await bcrypt.hash(password, await bcrypt.genSalt(12)),
                // createdAt: Date.now(),
            }).save()
            if(save){
                const user = {
                    username: save.username,
                    per: 0,
                    id: save._id
                }
                const token = jwt.sign(user, process.env.TOKEN_SECRET, {
                    expiresIn: 60 * 5
                })
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: 60 * 60 * 24 * 30
                })
                await User.findOneAndUpdate({
                    username: username.toLowerCase(),
                    }, {
                        $push: {
                            refreshToken: refreshToken,
                        }
                })
                return res.json({success: true, token: token, refreshToken: refreshToken})
            }else
                return res.json({success: false, msg: 'Somethings wrong!'})
        }
    }

    async token(req, res) {
        const { refreshToken } = req.body
        if (refreshToken === null || !refreshToken)
            return res.json({success: false, msg: 'Not found'})
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err)
                return res.json({success: false, msg: 'RefreshToken die'})
            const user = await User.findById(decoded.id)
            if(!user){
                return res.json({success: false, msg: 'User not found'})
            }
            if (user.refreshToken.includes(refreshToken)){
                const userToken = {
                    username: decoded.username,
                    per: decoded.per,
                    id: decoded.id
                }
                const token = jwt.sign(userToken, process.env.TOKEN_SECRET, {
                    expiresIn: 60 * 5
                })
                return res.json({
                    success: true,
                    accessToken: token
                })
            }else{
                return res.json({success: false, msg: 'RefreshToken not found'})
            }
        })
    }

    async logout(req, res) {
        const { refreshToken } = req.body
        if (!refreshToken)
            return res.json({success: false, msg: 'Cannot find refreshToken!'})
        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            await User.findOneAndUpdate({
                _id: decoded.id
            },{
                $pull: {
                    refreshToken: refreshToken
                }
            })
            return res.json({success: true, msg: 'Logout successful!'})
        })
    }

}
module.exports = new Auth