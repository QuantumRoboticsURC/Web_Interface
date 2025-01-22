var ros;
var robot_IP;
var bot;
robot_IP = _config.ROSBridge_IP;
var filter = false;

ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
    });
var camara_topic= 1;
var simpledrive = new ROSLIB.Topic ({
  ros : ros,
  name : 'SD_WI',
  messageType: 'std_msgs/Bool',
  queue_size: 10
})

var camera_quality = new ROSLIB.Topic ({
  ros : ros,
  name : '/image_quality',
  messageType: 'std_msgs/Int8',
  queue_size: 1
})
var cam_selection = new ROSLIB.Topic ({
  ros : ros,
  name : '/selected_camera',
  messageType: "std_msgs/Int8",
  queue_size: 1
})
var calidad=7;

let socket;
function connectCamera() {
  const portNumber = document.getElementById('Camera_Port').value;
  const ipCamera = document.getElementById('Camera_IP').value;
  console.log("Connecting to camera on port:", portNumber);

  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
  }

  socket = new WebSocket(`ws://${ipCamera}:${portNumber}`);

  socket.onopen = function(event) {
    console.log("WebSocket is open now.");
  };

  socket.onmessage = function(event) {
    const imgElement = document.getElementById('Zed_Camera');
    imgElement.src = 'data:image/jpeg;base64,' + event.data;
  };

  socket.onclose = function(event) {
    console.log("WebSocket is closed now.");
    console.log(`Code: ${event.code}, Reason: ${event.reason}`);
  };

  socket.onerror = function(error) {
    console.error("WebSocket error:", error);
  };
}

function stop_video() {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
  }
  console.log("Video stopped and WebSocket connection closed");
}


function activate_simpledrive(activation){
  simpledrive.publish(new ROSLIB.Message({data:activation}));
  console.log(activation);
}

function change_quality(resol){
  camera_quality.publish(new ROSLIB.Message({data:parseInt(resol)}));
  calidad=resol;
  console.log(resol);
}


if (_config.is_WebVideo){
  var zed_topic = _config.topic_Zed_Camera;
  var zed_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + zed_topic + "&type=mjpeg";
  document.getElementById("Zed_Camera").src = zed_src; 
}
