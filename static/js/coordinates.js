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




