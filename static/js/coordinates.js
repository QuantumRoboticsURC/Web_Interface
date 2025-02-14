var ros;
var robot_IP;
var bot;

var status = 0;
var statusTestjaja = 0; 
//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});



var coordinates = new ROSLIB.Topic({
  ros:ros,
  name:'ublox/gps_goal',
  messageType: 'std_msgs/Float64MultiArray',
  queue_size:1
})

function publish_coordinates(){
  latitud=document.getElementById('Latitud_Txt').value;
  longitudl=document.getElementById('Longitud_Txt').value;
  console.log(latitud);
  coordenadas=latitud+","+longitudl;
  console.log(coordenadas);
  /*var message =new ROSLIB.Message({
      data: [parseFloat(latitud),parseFloat(longitudl)]
  })
  
  coordinates.publish(message);*/
  console.log("hola")
}


function setStatus(status){

	goBottonStatus = status;
    console.log("Status jajaja: " + goBottonStatus);
	
}

var statusPublisher = new ROSLIB.Topic({
    ros: ros,
    name: '/target_type',
    messageType: 'std_msgs/Int8'
});

function botonClick() {
   
    menu = document.getElementById("Objective_type");
    goBottonStatus = menu.options[menu.selectedIndex].value;
    console.log("Status jaja: " + goBottonStatus);
    var statusMessage = new ROSLIB.Message({
        data: goBottonStatus
    });
    statusPublisher.publish(statusMessage);
}

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
        document.getElementById("VeloAngular").innerHTML=(angular);
        document.getElementById("VeloLinear").innerHTML=(linear);
        //document.getElementById("leftTrac").innerHTML=((angular+linear)*303).toFixed(2) + ' RPM';
        //document.getElementById("rigthTrac").innerHTML=Math.abs((-angular+linear)*303).toFixed(2) + ' RPM';
  });

  var listener3 = new ROSLIB.Topic({
    ros : ros,
    name : '/latitude',
    messageType : 'std_msgs/Float64'
  });
  listener3.subscribe(function(message){
    document.getElementById("Latitud").innerHTML = message.data
  })


  var listener4 = new ROSLIB.Topic({
    ros : ros,
    name : '/longitude',
    messageType : 'std_msgs/Float64'
  });
  listener4.subscribe(function(message){
    document.getElementById("Longitud").innerHTML = message.data
  })

  var listener5 = new ROSLIB.Topic({
    ros: ros,
    name: "/predicted_angle",
    messageType: 'std_msgs/Float32MultiArray'
  })
  
  listener5.subscribe(function(message){
    var data = message.data
    document.getElementById("Angle").innerHTML = data[0];
    document.getElementById("AngleY").innerHTML = data[1];
    document.getElementById("AngleZ").innerHTML = data[2];
  })
