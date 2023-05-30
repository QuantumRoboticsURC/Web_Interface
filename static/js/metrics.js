var ros;
var robot_IP;

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