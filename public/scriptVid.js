const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer('undefined', {
  secure: true, 
  host: 'morning-fjord-33054.herokuapp.com',
  port: '9005',
  path: '/myapp'
})
// const socket = require('socket.io-client')({
//   path: '/videochat'
// })

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  
myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      $("p")[2].innerText="another person connected,say hello!"
      
      addVideoStream(video, userVideoStream)
    })
  })
    let user_count=1
socket.on('user-connected', userId => {
    user_count++; //set flag true for block new userId   
    console.log(user_count)
  //  if (user_count<3)
    connectToNewUser(userId, stream)
  })
// document.getElementById("abort").onclick = function() {
 
// $(this).text(function(i, text){
// if (text==="Hang-up") {
//   stream.getTracks().forEach(function(track) {
//       track.stop();
//     });      
//   removeVideo();
//    $(this).className="btn badge-info" 
// } else {
//   location.reload()
//   $(this).className="btn btn-danger" 
// }
// })
//   $(this).text(function(i, text){
//     return text === "Hang-up" ? "Join again" : "Hang-up";
// }) 

// }; 
document.getElementById("muteunmute").onclick = function() {
  $(this).text(function(i, text){
    return text === "Mute" ? "Unmute" : "Mute";
})
    stream.getVideoTracks()[0].enabled =
     !(stream.getVideoTracks()[0].enabled);
      }  
   
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
    $("p")[2].innerText="another person connected"
    addVideoStream(video, userVideoStream)
  })
  // call.on('streamend', () =>{removeVideo();console.log("working")} )
  call.on('close', () => {
    video.remove()
    $("p")[2].innerText="another person left,enough for today"

  })

  peers[userId] = call
}

function removeVideo(){  
  $("p")[2].innerText="another person left,enough for today"
  $("#video-grid").remove()
}
let count=0
function addVideoStream(video, stream) {    
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
 
  if (!count) {
    $("p")[2].innerText="stay tuned,you will be notified shortly when another joins you"
              }
  else { otherstream=stream
    $("p")[2].innerText="another person connected,enough for today"}
  count++;
}