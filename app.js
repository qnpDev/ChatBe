const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const route = require('./components/routes')
require('dotenv').config()
require('./components/models')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(__dirname + 'public'));
app.use(cors({
    origin: '*',
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
    optionSuccessStatus: 200,
}))

const server = app.listen(process.env.PORT || 9000, () => {
    console.log('qnp | server started!')
})

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    next()
})

route(app)

//Index page
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/components/views/index.html')))
// Err
app.get('*', (req, res) => res.status(404).sendFile(path.join(__dirname, '/components/views/index.html')))

// Author: qnp //

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

require('./components/socket')(io)