var ros;
var robot_IP;

window.onload = function () {
    //IP de la compu donde esta corriendo ros bridge
    robot_IP = "127.0.0.1";

    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });

    var listener3 = new ROSLIB.Topic({
      ros : ros,
      name : '/zed2/zed_node/left/image_rect_color/compressed',
      messageType : 'sensor_msgs/CompressedImage'
    });

  listener3.subscribe(function(message) {
    //document.getElementById("liveimage").innerHTML = m.data;
    console.log("image listenerr event fired");
    var imagedata = "data:image/jpeg;base64," + message.data;
    document.getElementById("img").src = imagedata;      
    //document.getElementById("liveimage").src =  m.data;      
  });
}