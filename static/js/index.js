var ros;
var robot_IP;
var bot;
robot_IP = _config.ROSBridge_IP;

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
  name : 'selected_camera',
  messageType: "std_msgs/Int8",
  queue_size: 1
})

function change_camera(camera){
    if(camera==1){
      var zed_topic = _config.topic_USB_Camera;
      
    } else if(camera==2){
      var zed_topic = _config.topic_Arm_Camera;
    } else if (camera==3){
      var zed_topic = _config.topic_USB2_Camera;
    } else if (camera==4){
      var zed_topic = _config.topic_Zed_Camera;
    }
    var zed_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + zed_topic + "&type=mjpeg";
    document.getElementById("Zed_Camera").src = zed_src;
    console.log(camara_topic);

    cam_selection.publish(new ROSLIB.Message({ data: camera }));
    console.log("Camera selected: " + camera);
}

function activate_simpledrive(activation){
  simpledrive.publish(new ROSLIB.Message({data:activation}));
  console.log(activation);
}

function change_quality(resol){
  camera_quality.publish(new ROSLIB.Message({data:parseInt(resol)}));
  console.log(resol);
}


if (_config.is_WebVideo){
  var zed_topic = _config.topic_Zed_Camera;
  var zed_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + zed_topic + "&type=mjpeg";
  document.getElementById("Zed_Camera").src = zed_src; 
}
