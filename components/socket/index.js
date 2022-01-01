const Chat = require('../models/Chat.Model')
const User = require('../models/User.Model')
const ChatPublic = require('../models/ChatPublic.Model')
let listSocket = []
const socketConnect = io => {

    io.use((socket, next) => {
        const { id, name, avatar } = socket.handshake.auth
        if(!id || !name || !avatar){
            return next(new Error('Auth false'))
        }
        socket.user = { 
            id, 
            name, 
            avatar,
        }
        let flag = false
        listSocket.map((value, index) => {
            if(value.data.id === id){
                listSocket[index].id = [...listSocket[index].id, socket.id]
                flag = true
            }
        })
        if(!flag)
            listSocket.push({
                id: [socket.id],
                data: socket.user
            })
        return next()
    })

    io.on('connection', socket => {
        io.emit('listOnline', listSocket)
        socket.on('disconnect', () => {
            listSocket.map((value, index) => {
                if(value.id.includes(socket.id)){
                    if(value.id.length < 2){
                        listSocket = listSocket.filter(v => !v.id.includes(socket.id))
                    }else{
                        listSocket[index].id = listSocket[index].id.filter(v => v !== socket.id)
                    }
                }
            })
            io.emit('listOnline', listSocket)
        })

        socket.on('privateMessage', data => {
            listSocket.map(value => {
                if(value.data.id === data.from){
                    value.id.map(v => 
                        io.to(v).emit('privateMessage', data)
                    )
                }else if(value.data.id === data.to){
                    value.id.map(v => {
                        io.to(v).emit('privateMessage', data)
                        io.to(v).emit('privateMessageNotif', data)
                    })
                }
            })
            new Chat({
                from: data.from,
                to: data.to,
                content: data.content,
            }).save()
            
        })

        socket.on('publicMessage', data => {
            io.emit('publicMessage', data)
            new ChatPublic({
                from: data.from._id,
                content: data.content,
            }).save()
        })
    })
}

module.exports = socketConnect