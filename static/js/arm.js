var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});
//Camera
if (_config.is_WebVideo){
    var topic = _config.topic_Arm_Camera;
    var src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + topic + "&type=ros_compressed";
    document.getElementById("Arm_Camera").src = src; 
} else {
    var listener = new ROSLIB.Topic({
        ros : ros,
        name : _config.topic_Arm_Camera + '/compressed',
        messageType : 'sensor_msgs/CompressedImage'
    });

    listener.subscribe(function(message) {
        var imagedata = "data:image/png;base64," + message.data;
        document.getElementById("Arm_Camera").src = imagedata;
    });
}  

//Joystick
var listener_Joystick = new ROSLIB.Topic({
    ros : ros,
    name : '/goal',
    messageType : 'std_msgs/String'
});

listener_Joystick.subscribe(function(message) {
    values = message.data.split(" ");
    if (values[0]!=0 || values[1]!=0 || values[2]!=0 || values[3]!=0.0 || values[4]!=-0.0){
        console.log("entra a if_")
        values_map.joint1 += parseFloat(values[0]);  //x
        values_map.joint2 += parseFloat(values[1]); //y
        values_map.joint3 += parseFloat(values[2]); //z
        values_map.joint4 += parseFloat(values[3]); //phi

        angles_map.gripper += parseFloat(values[4]); //rotation
        console.log(values);

        inverseKinematics(values_map.joint1, values_map.joint3, values_map.joint4);
        getTxt();
    };
});

//Joystick
var listener_predefined = new ROSLIB.Topic({
    ros : ros,
    name : '/predefined',
    messageType : 'std_msgs/String'
});

listener_predefined.subscribe(function(message) {
    predefinedPosition(message.data);
    console.log(message.data)
});

var pub_arm = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop',
    messageType : 'custom_messages/arm',
    queue_size: 1
});

/*
float64 joint1
float64 joint2
float64 joint3
float64 joint4 # Phi
int32 joint5 #Gripper rotation
float64 gripper #lineal
float64 prism
string inverse_kinematics
*/

//Camera 
var camera = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/cam',
    messageType : 'std_msgs/Int32',
    queue_size: 1   
});

//Initial values
var gripper_apertur = 60;   //0 y 60
var values_map = {
    joint1: .134,   //.4
    joint3: .75,
    joint4: 0,      //phi
    joint8: 140 //camera
};
var lineal_actuators = {
    gripper : 0,
    prism : 0
}
var l1 = 0;
var l2 = 2.6;
var l3 = 2.6;
var l4 = .9;

//Limits
var limits_map = {
    q1:[-95,90],
    q2:[0,161],
    q3:[-165.4,0],
    q4:[-135,90],
    gripper:[-90,90], 
    camera:[90,140]
};

var angles_map={
    q1:0,
    q2:161,
    q3:-165.4,
    q4:0,
    gripper:0
};
var limit_z = -4.2;
var limit_chassis = 1.1; //11cm del chasis

// Predefined positions
function predefinedPosition(position){

    var x = values_map.joint1;
    var y = angles_map.q1;
    var z = values_map.joint3;
    var phi = values_map.joint4;

    if (position === "HOME"){
        x = .134;
        y =  -5;
        z =  .75;
        phi = 0;
    } else if(position === "INTERMEDIATE"){
        x = 0;
        y = -5;
        z = 3.677;
        phi = 0;
    }else if(position === "PULL"){
        x = 3.33;
        y = -5;
        z = 3.35;
        phi = 0;
    }else if (position === "WRITE"){
        x = 3.33;
        y = -5;
        z = 1.35;
        phi = 0;        
    }else if (position === "FLOOR"){
        x = 3.28
        y = -5
        z = -.1
        phi = 0
    }else if (position === "STORAGE"){
        x = .134;
        y =  -5;
        z =  .75;
        phi = 90
    }else if (position === "VERTICAL"){
        x = 0;
        y =  -5;
        z =  5.2;
        phi = 90
    }

    values_map.joint1 = x;
    values_map.q1 = y;
    values_map.joint3 = z;
    values_map.joint4 = phi;
    inverseKinematics(values_map.joint1, values_map.joint3, values_map.joint4);
    }

function publish_angles(){    
    var message = new ROSLIB.Message({
        joint1: angles_map.q1,
        joint2: angles_map.q2,
        joint3: angles_map.q3,
        joint4: angles_map.q4,
        joint5: angles_map.gripper,
        gripper: lineal_actuators.gripper,
        prism: lineal_actuators.prism
    }); 
    pub_arm.publish(message);
}

// go to phi
function go_phi(data){
    var key = "joint4";
    var prev = values_map[key];        
    values_map[key]=data;
    var poss = inverseKinematics(values_map.joint1, values_map.joint3, self.values_map.joint4);            
    if(!poss){
        values_map[key] = prev;
    }   
    getTxt();
}

// 
function phi(data){
    var key = "joint4";
    var prev = values_map[key];        
    values_map[key]+=data;
    var poss = inverseKinematics(values_map.joint1, values_map.joint3, self.values_map.joint4);            
    if(!poss){
        values_map[key] = prev;
    }
    getTxt();
}

// Gripper go to particular location
function go(data){
    angles_map.gripper=data;
    angles_map.gripper = qlimit(limits_map.gripper, values_map.gripper);    
    getTxt();
}

// Rotate gripper N grades
function griperRotation(data){
    values_map[key]+=data;
    values_map[key] = qlimit(limits_map[key], values_map[key]);
    getTxt();
}

// Open gripper
function moveGripper(data){    
    lineal_actuators.gripper = data;
    getTxt();  
}
// Open linear
function movePrismatic(data){    
    lineal_actuators.prism = data;
    getTxt();
}

// Move general camera
function moveCamera(data){
    key = "joint8";
    values_map[key] += (data);    
    values_map[key] = qlimit(limits_map.camera, values_map[key]);
    var msn = new ROSLIB.Message({data : parseInt(values_map[key])});
    camera.publish(msn);
    getTxt();
}

//Rotate
function go_rotation(data){
    angles_map.q1=data;
    angles_map.q1 = qlimit(limits_map.q1,angles_map.q1);
    getTxt();
}

//Rotate
function rotate(data){
    angles_map.q1+=data;
    angles_map.q1 = qlimit(limits_map.q1,angles_map.q1);
    getTxt();
}

//Buttons related to inverse kinematics
function pressed(data, joint){
    var key = "joint" + String(joint);
    values_map[key] += data
    var poss = inverseKinematics(values_map.joint1, values_map.joint3, self.values_map.joint4);          
    
    if(!poss){
        values_map[key]-=data;
    }       
    getTxt();
}

function inverseKinematics(xm, zm, phi_int){
    //Para q1
    let q1=angles_map.q1
    q1=qlimit(limits_map.q1,q1);

    //Para q2
    let hip=math.sqrt(math.pow(xm,2)+math.pow((zm-l1),2));    
    let phi = math.complex(math.atan2(zm-l1, xm))
    let beta=math.acos((math.pow(l2,2)+math.pow(hip,2)-math.pow(l3,2))/(2*l2*hip)); //da negativo cuando no funciona 
    let Q2=math.add(phi,beta).re;//math.re(phi+beta);
    let q2=rad2deg(Q2)
    q2=qlimit(limits_map.q2,q2);

    //Para q3  
    let gamma=math.re(math.acos((math.pow(l2,2)+math.pow(l3,2)-math.pow(hip,2))/(2*l2*l3)));   
    let Q3=math.re(gamma-math.pi);
    let q3=rad2deg(Q3);
    q3=qlimit(limits_map.q3,q3);

    //Para q4
    let q4 = phi_int - q2 -q3;
    q4=qlimit(limits_map.q4,q4);
    values_map.joint4 = q4+q2+q3;

    // Verificar que no rompa algo
    let acum = deg2rad(q2);
    let x2 = l2*math.cos(acum);
    let y2 = l2*math.sin(acum);
    acum+=deg2rad(q3);
    let x3 = x2+l3*math.cos(acum);
    let y3 = y2+l3*math.sin(acum);
    acum+=deg2rad(q4);
    let x4 = x3+l4*math.cos(acum);
    let y4 = y3+l4*math.sin(acum);    
    if(y4>limit_z && (x4>limit_chassis || y4>=0)){
        values_map.joint1 = x3;
        values_map.joint3 = y3;

        angles_map.q2=q2;
        angles_map.q3=q3;
        angles_map.q4=q4;
        arm_interface(angles_map.q2,angles_map.q3,angles_map.q4);        
        return true
    }else{
        arm_interface(angles_map.q2,angles_map.q3,angles_map.q4);
        return false;
    }    
}


function qlimit(l, val){   //limites
    if (val < l[0]){ //inferior
        return l[0];
    }
    if (val > l[1]){ //superior 
        return l[1];
    }
    return val;
}

function my_map(in_min, in_max, out_min, out_max, x){ //map arduino
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function rad2deg(radians){return radians * (180/math.pi);}
function deg2rad(degrees){return degrees * (math.pi/180);}

function getTxt(){
    publish_angles();
    var X = String(math.round(values_map.joint1,2));    
    var Z = String(math.round(values_map.joint3,2));
    var Phi = String(values_map.joint4);
    var Rotacion = String(angles_map.gripper);
    var q1 = String(math.round(angles_map.q1,2));
    var Y = q1;
    var q2 = String(math.round(angles_map.q2,2));
    var q3 = String(math.round(angles_map.q3,2));
    var q4 = String(math.round(angles_map.q4,2));
    var Camera = String(values_map.joint8);
  
    localStorage.setItem("Q1",q1);
    localStorage.setItem("Q2",q2);
    localStorage.setItem("Q3",q3);
    localStorage.setItem("Q4",q4);
    localStorage.setItem("X",X);
    localStorage.setItem("Y",Y);
    localStorage.setItem("Z",Z);
    localStorage.setItem("Phi",Phi);
    localStorage.setItem("Rotacion",Rotacion);
    localStorage.setItem("Camera",Camera);

    document.getElementById("Q1").innerHTML = q1;
    document.getElementById("Q2").innerHTML = q2;
    document.getElementById("Q3").innerHTML = q3;
    document.getElementById("Q4").innerHTML = q4;
    document.getElementById("X").innerHTML = X;
    document.getElementById("Y").innerHTML = Y;
    document.getElementById("Z").innerHTML = Z;
    document.getElementById("Phi").innerHTML = Phi;
    document.getElementById("Rotacion").innerHTML = Rotacion;
    document.getElementById("Camera").innerHTML = Camera;
}

  //Función de gráfica
function arm_interface(q2,q3,q4){    
	//Transformación a coordenadas rectangulares
    let acum = deg2rad(q2);
	let x2=l2*math.cos(acum);
	let y2=l2*math.sin(acum);
    acum+=deg2rad(q3);
	let x3=x2+l3*math.cos(acum);
	let y3=y2+l3*math.sin(acum);
    acum+=deg2rad(q4);
	let x4=x3+l4*math.cos(acum);
	let y4=y3+l4*math.sin(acum);    
	//Gráfica
	var armData={
  		labels:[],//x label
  		datasets:[{
    		//Joint 2
    			label:"joint 2",//legend
    			data:[
      				{x:0,y:0},
      				{x:x2,y:y2}
    			],
    			lineTension: 0, //linea recta
    			fill: false, //rellenar debajo de la linea
    			borderColor:'blue',//color de línea
    			backgroundColor:'transparent',//color de fondo
    			pointBorderColor:'blue',//apariencia de los puntos
    			pointBackgroundColor: 'blue',
    			pointRadius:2,
    			pointStyle:'rectRounded',
    			showLine: true
  		},
  		{
    		//Joint 3
    			label:"joint 3",//legend
    			data:[
      				{x:x2,y:y2},
      				{x:x3,y:y3}
    			],
    			lineTension: 0, //linea recta
    			fill: false, //rellenar debajo de la linea
    			borderColor:'red',//color de línea
    			backgroundColor:'transparent',//color de fondo
    			pointBorderColor:'red',//apariencia de los puntos
    			pointBackgroundColor: 'red',
    			pointRadius:2,
    			pointStyle:'rectRounded',
    			showLine: true
  		},
  		{
    		//Joint 4  
    			label:"joint 4",//legend
    			data:[
      				{x:x3,y:y3},
      				{x:x4,y:y4}
    			],
    			lineTension: 0, //linea recta
    			fill: false, //rellenar debajo de la linea
    			borderColor:'green',//color de línea
    			backgroundColor:'transparent',//color de fondo
    			pointBorderColor:'green',//apariencia de los puntos
    			pointBackgroundColor: 'green',
    			pointRadius:2,
    			pointStyle:'rectRounded',
    			showLine: true
  		}]
	}
	var chartOptions = {
  		legend:{
    			display:false //Ocultar labels
  		},
  		scales:{
    			xAxes:[{
      				ticks:{
        				beginAtZero:true,
        				min:-6,
        				max:6
      				}
    			}],
    			yAxes:[{
      				ticks:{
        				beginAtZero:true,
        				min:-6,
                        max:6                        
      				}
    			}]
  		},    
        animation: {
            duration: 0
        }
	};
	new Chart("Arm_Graphic",{
  		type: "scatter",
  		data: armData,
  		options: chartOptions
	});
}

