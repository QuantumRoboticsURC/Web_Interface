var ros;
var robot_IP;
robot_IP = _config.ROSBridge_IP;

    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });
window.onload = function () {
  robot_IP = _config.ROSBridge_IP;

  ros = new ROSLIB.Ros({
      url: "ws://" + robot_IP + ":9090"
  });
    var listener = new ROSLIB.Topic({
      ros : ros,
      name : '/matrix_signal',
      messageType : 'std_msgs/Int8'
    });

    listener.subscribe(function(message) {
          switch(message.data){
            case 1:
              document.getElementById("ledLabel").style.backgroundColor = "#0000ff";
              document.getElementById("ledText").innerHTML = "Teleoperated";
              break;
            case 2:
              document.getElementById("ledLabel").style.backgroundColor = "#ff0000";
              document.getElementById("ledText").innerHTML = "Autonomous";
              break;
            case 3:
              document.getElementById("ledLabel").style.backgroundColor = "#00ff00";
              document.getElementById("ledText").innerHTML = "Successfull arrival";
              break;
            default:
              document.getElementById("ledLabel").style.backgroundColor = "#ffffff";
              document.getElementById("ledText").innerHTML = " ";
              break;

          }
    });

    var listener2 = new ROSLIB.Topic({
        ros : ros,
        name : '/cmd_vel',
        messageType : 'geometry_msgs/Twist'
      });

    listener2.subscribe(function(message) {
          var angular = message.angular.z;
          var linear = message.linear.x;
          document.getElementById("VeloAngular").innerHTML=(angular * 100).toFixed(2) + ' %';
          document.getElementById("VeloLinear").innerHTML=(linear * 100).toFixed(2) + ' %';
          document.getElementById("leftTrac").innerHTML=((angular+linear)*303).toFixed(2) + ' RPM';
          document.getElementById("rigthTrac").innerHTML=Math.abs((-angular+linear)*303).toFixed(2) + ' RPM';
    });
}

var coordinates = new ROSLIB.Topic({
  ros:ros,
  name:'ublox/gps_goal',
  messageType: 'sensor_msgs/NavSatFix',
  queue_size:1
})

function publish_coordinates(){
  latitud=document.getElementById('Latitud_Txt').value;
  longitudl=document.getElementById('Longitud_Txt').value;
  console.log(latitud);
  coordenadas=latitud+","+longitudl;
  console.log(coordenadas);
  var message =new ROSLIB.Message({
      latitude: parseFloat(latitud),
      longitude: parseFloat(longitudl)
  })
  
  coordinates.publish(message);
  console.log("hola")
}
var antenna_on = new ROSLIB.Service({
  ros : ros,
  name : '/camera_antenna/start_capture',
  serviceType : 'std_srvs/Empty'
  });
var antenna_off = new ROSLIB.Service({
  ros : ros,
  name : '/camera_antenna/stop_capture',
  serviceType : 'std_srvs/Empty'
  });
var centrifuge_on = new ROSLIB.Service({
  ros : ros,
  name : '/zed2i/zed_node/start_remote_stream',
  serviceType : 'std_srvs/Empty'
  });
var centrifuge_off = new ROSLIB.Service({
  ros : ros,
  name : '/zed2i/zed_node/stop_remote_stream',
  serviceType : 'std_srvs/Empty'
  });
var arm_on = new ROSLIB.Service({
  ros : ros,
  name : '/camera_arm/start_capture',
  serviceType : 'std_srvs/Empty'
  });
var arm_off = new ROSLIB.Service({
  ros : ros,
  name : '/camera_arm/stop_capture',
  serviceType : 'std_srvs/Empty'
  });
function Camera_on_off(cam,status){
  switch(cam){
      case(1):
          if (status){
              var request = new ROSLIB.ServiceRequest({});
              antenna_on.callService(request,function(){console.log("on")});
              
          } else{
              var request2 = new ROSLIB.ServiceRequest({});
              antenna_off.callService(request2,function(){console.log("off")});
              
          }
          break;
      case(2):
          if (status){
              var request3 = new ROSLIB.ServiceRequest({});
              centrifuge_on.callService(request3,function(){console.log("on")});    
          } else{
              var request4 = new ROSLIB.ServiceRequest({});
              centrifuge_off.callService(request4,function(){console.log("off")});
          }
          break;
      case(3):
          if (status){
              var request5 = new ROSLIB.ServiceRequest({});
              arm_on.callService(request5,function(){console.log("on")});    
          } else{
              var request6 = new ROSLIB.ServiceRequest({});
              arm_off.callService(request6,function(){console.log("off")});
          }
          break;
  }
}