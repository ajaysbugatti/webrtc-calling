//const socket = io('/',{path:'/audiochat'})
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  secure:true,
  host: '/',//
  port: '5000',
  path:'/peerjs/myapp'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true
}).then(stream => {
 addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
     const audio = document.createElement('video')
    call.on('stream', userAudioStream => {
      addVideoStream(audio, userAudioStream)
    })
  })
let user_count=1
  socket.on('user-connected', userId => {
    user_count++; //set flag true for block new userId   
    console.log(user_count)
    // if(user_count==2){$("p")[2].innerText="another person connected"}
    // if (user_count<3)
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {  
    $("p")[2].innerText="another person connected,say hello!"
  })
  call.on('close', () => {
    video.remove()
    $("p")[2].innerText="another person left,enough for today!!"
  })

  peers[userId] = call
}
let count=0;
function addVideoStream(video,stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  if (!count) {
      $("p")[2].innerText="stay tuned,you will be notified shortly when another joins you"
 }
else {
$("p")[2].innerText="another person connected,say hello!";
var audio = new Audio('/promise.mp3');
audio.play();}
count++;
videoGrid.append(video)
}