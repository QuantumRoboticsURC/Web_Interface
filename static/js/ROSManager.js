var ros;
var robot_IP;

window.onload = function () {
    //IP de la compu donde esta corriendo ros bridge 192.168.1.6
    robot_IP = "localhost";

    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });

    var listener2 = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
      });

    listener2.subscribe(function(message) {
          //console.log(message);
          var angular = message.angular.z;
          var linear = message.linear.x;
          document.getElementById("VeloAngular").innerHTML=(angular * 100).toFixed(2) + ' %';
          document.getElementById("VeloLinear").innerHTML=(linear * 100).toFixed(2) + ' %';
          document.getElementById("leftTrac").innerHTML=((angular+linear)*303).toFixed(2) + ' RPM';
          document.getElementById("rigthTrac").innerHTML=Math.abs((-angular+linear)*303).toFixed(2) + ' RPM';
    });

    var listener3 = new ROSLIB.Topic({
      ros : ros,
      name : '/usb_cam_1/image_raw/compressed',
      messageType : 'sensor_msgs/CompressedImage'
    });

  listener3.subscribe(function(message) {
    //document.getElementById("liveimage").innerHTML = m.data;
    console.log("image listenerr event fired");
    var imagedata = "data:image/png;base64," + message.data;
    document.getElementById("imgUSB").src = imagedata;      
    //document.getElementById("liveimage").src =  m.data;      
  });

var listener5 = new ROSLIB.Topic({
  ros : ros,
  name : '/zedNav/zed_nav/left/image_rect_color/compressed',
  messageType : 'sensor_msgs/CompressedImage'
});

listener5.subscribe(function(message) {
//document.getElementById("liveimage").innerHTML = m.data;
console.log("image listenerr event fired");
var imagedata = "data:image/png;base64," + message.data;
document.getElementById("imgNav").src = imagedata;      
//document.getElementById("liveimage").src =  m.data;      
});

    var listener = new ROSLIB.Topic({
      ros : ros,
      name : '/matrix',
      messageType : 'std_msgs/Int64'
    });

    listener.subscribe(function(message) {
          switch(message.data){
            case 0:
              document.getElementById("IdLed").className = "led-red";
              break;
            case 1:
              document.getElementById("IdLed").className = "led-blue";
              break;
            case 2:
              document.getElementById("IdLed").className = "led-green";
              break;
            default:
              document.getElementById("IdLed").className = "";
              break;

          }
    });
}

function manual(){
  var man = new ROSLIB.Topic({
    ros : ros,
    name : '/matrix',
    messageType : 'std_msgs/Int64'
  });

  var msn = new ROSLIB.Message({
    data : 1
  });

  man.publish(msn);
}

function auto(){
  var man = new ROSLIB.Topic({
    ros : ros,
    name : '/matrix',
    messageType : 'std_msgs/Int64'
  });

  var msn = new ROSLIB.Message({
    data : 0
  });
  
  man.publish(msn);
}