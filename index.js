const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
// server-side
// const io = require('socket.io')({
//   path: '/audiochat/id'
// });
//const io = require('socket.io')
const { v4: uuidV4 } = require('uuid')
const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9005,
  // ssl: {
  //   key: fs.readFileSync('certificates/key.pem'),
  //   cert: fs.readFileSync('./certificates/cert.pem')
  // },
  path: '/myapp'
  });
app.set('view engine', 'ejs')
app.use(express.static('public'))
// app.get('/audiochat', (req, res) => {
//   res.redirect(`/video/${uuidV4()}`)
// })
app.get('/', (req, res) => {
  res.redirect('/audiochat')
})
app.get('/audiochat', (req, res) => {
  res.render('roomAud', { roomId: 'audiochat' })
})

app.get('/videochat', (req, res) => {
  res.render('roomVid', { roomId: 'videochat' })
})
app.get('/exit', (req, res) => {
res.send("successfully hanged up .go back same url to rejoin" );
})
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    console.log('joined')
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 5000)