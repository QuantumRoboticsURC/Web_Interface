var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + "10.48.69.252" + ":9090"
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
  values_map.joint5 += parseFloat(values[4]); //gripper rotation
  values_map.joint8 += parseFloat(values[5]); // camera
  values_map.joint5=qlimit(limits_map["joint5"], values_map["joint5"]);
  values_map.joint8=qlimit(limits_map.camera, values_map["joint8"]);
  console.log(values);
    var msn = new ROSLIB.Message({
    data : parseInt(my_map(-90,90,138,312,values_map["joint5"]))});
    joint5.publish(msn); 
    var msn2 = new ROSLIB.Message({data : parseFloat(values_map["joint8"])});
    camera.publish(msn2);
    console.log("AAAAAAAAAAAAAa");
  inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);

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

var pub_q1 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint1',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
var pub_q2 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint2',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
var pub_q3 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint3',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
var pub_q4 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint4',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
var pub_q_string = new ROSLIB.Topic({
    ros : ros,
    name : 'inverse_kinematics/Q',
    messageType : 'std_msgs/String',
    queue_size: 1   
});
//gripper rotation
var joint5 = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/joint5',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
//lineal 
var gripper = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/gripper',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
//lineal 
var lineal = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/prism',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
//Camera 
var camera = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/cam',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});

//Initial values
var gripper_apertur = 60;   //0 y 60
var values_map = {
    joint1: .134,   //.4
    joint2: 0,      //.9
    joint3: .75,
    joint4: 0,      //phi
    joint5: 0,   //rotacion
    joint8: 140 //camera
};
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
    joint5:[-90,90], 
    camera:[90,140]
};

var angles_map={
    q1:0,
    q2:161,
    q3:-165.4,
    q4:0
};
var limit_z = -4.2;
var limit_chassis = 1.1; //11cm del chasis

// Predefined positions
function predefinedPosition(position){

    var x = values_map.joint1;
    var y = values_map.joint2;
    var z = values_map.joint3;
    var phi = values_map.joint4;
    
    /*if(position === "INTERMEDIATE"){
        x = 0;
        y = -5;
        z = 3.677;
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
    }else if (position === "BOX"){
        x = 0;
        y = -94;
        z = 3.68
        phi = 0;
    }*/
    
    if (position === "HOME"){
        x = .134;
        y =  0;
        z =  .75;
        phi = 0;
        
    } 
    else if(position === "INTERMEDIATE"){
        x = 0;
        y = 0;
        z = 3.677;
        phi = 0;
        
    }
    else if(position === "PULL"){
        x = 3.33;
        y = 0;
        z = 3.35;
        phi = 0;
        
    }
    else if (position === "WRITE"){
        x = 3.33;
        y = 0;
        z = 1.35;
        phi = 0;  
           
    }
    else if (position === "FLOOR"){
        x = 3.28;
        y = 0;
        z = -.1;
        phi = 0;
        
    }
    else if (position === "STORAGE"){
        x = .134;
        y =  0;
        z =  .75;
        phi = 90;
        
    }
    else if (position === "VERTICAL"){
        x = 0;
        y =  0;
        z =  5.2;
        phi = 90;
        
    }

    values_map.joint1 = x;
    values_map.joint2 = y;
    values_map.joint3 = z;
    values_map.joint4 = phi;
    inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
    go_rotation(values_map.joint2);
    return position;
    }
function StateMachine(position){
    

    return true;
}
function publish_angles(){
    var q1 = angles_map.q1;
    var q2 = angles_map.q2;
    var q3 = angles_map.q3;
    var q4 = angles_map.q4;

    var txt = String(q1)+" "+String(q2)+" "+String(q3)+" "+String(q4)

    var msn_q1 = new ROSLIB.Message({data : q1});
    var msn_q2 = new ROSLIB.Message({data : q2});
    var msn_q3 = new ROSLIB.Message({data : q3});
    var msn_q4 = new ROSLIB.Message({data : q4});
    var msn_txt = new ROSLIB.Message({data : txt});

    pub_q1.publish(msn_q1);
    pub_q2.publish(msn_q2);
    pub_q3.publish(msn_q3);
    pub_q4.publish(msn_q4);
    pub_q_string.publish(msn_txt);
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


// go to phi
function go_phi(data){
    var key = "joint4";
    var prev = values_map[key];        
    values_map[key]=data;
    var poss = inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, self.values_map.joint4);            
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
    var poss = inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, self.values_map.joint4);            
    if(!poss){
        values_map[key] = prev;
    }
    getTxt();
}

// Gripper go to particular location
function go(data){
    var key = "joint5";
    values_map[key]=data;
    values_map[key] = qlimit(limits_map[key], values_map[key]);
    var msn = new ROSLIB.Message({data : parseInt(my_map(-90,90,138,312,values_map[key]))});
    joint5.publish(msn);
    getTxt();
}

// Rotate gripper N grades
function griperRotation(data){

    var key = "joint5";
    values_map[key]+=data;
    values_map[key] = qlimit(limits_map[key], values_map[key]);
    var msn = new ROSLIB.Message({
        data : parseInt(my_map(-90,90,138,312,values_map[key]))
    });
    joint5.publish(msn); 
    getTxt();
}
// Open gripper
function moveGripper(data){    
    var msn = new ROSLIB.Message({data : data});
    gripper.publish(msn);           
}
// Open linear
function movePrismatic(data){    
    var msn = new ROSLIB.Message({data : data});
    lineal.publish(msn);
}

// Move general camera
function moveCamera(data){
    key = "joint8";
    values_map[key] += (data);    
    values_map[key] = qlimit(limits_map.camera, values_map[key]);
    var msn = new ROSLIB.Message({data : parseFloat(values_map[key])});
    camera.publish(msn);
    getTxt();
}

//Rotate
function go_rotation(data){
    angles_map.q1=data;
    angles_map.q1 = qlimit(limits_map.q1,angles_map.q1);
    values_map.joint2 = self.angles_map.q1;
    getTxt();
}

//Rotate
function rotate(data){
    angles_map.q1+=data;
    angles_map.q1 = qlimit(limits_map.q1,angles_map.q1);
    values_map.joint2 = self.angles_map.q1;
    getTxt();
}

//Buttons related to inverse kinematics
function pressed(data, joint, sign = 1){
    var key = "joint" + String(joint);

    values_map[key] += (data*sign);

    if(joint < 4 && joint != 2){
        var poss = inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, self.values_map.joint4);          
        if(!poss){
            values_map[key]+=(data*(sign));
        }
    }    
    getTxt();
}

function getTxt(){
    publish_angles();
    var X = String(math.round(values_map.joint1,2));
    var Y = String(math.round(values_map.joint2,2));
    var Z = String(math.round(values_map.joint3,2));
    var Phi = String(values_map.joint4);
    var Rotacion = String(values_map.joint5);
    var q1 = String(math.round(angles_map.q1,2));
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

function rad2deg(radians){return radians * (180/math.pi);}
function deg2rad(degrees){return degrees * (math.pi/180);}

function inverseKinematics(xm, ym, zm, phi_int){
    let Q1 = 0;
    /*if (xm != 0 || ym != 0 || zm != 0){
      if(xm == 0){
        if(ym>0){
          xm = ym;
          Q1 = math.pi/2;
        }else if (ym<0){
          xm = ym;
          Q1 = math.pi/2;
        }else if(ym == 0){
          Q1 = 0; 
        }
      }else if (xm < 0){
        if (ym == 0){
          Q1 = 0;
        }else if(ym < 0){
          //No lo he cambiado #real
          Q1 = math.re(math.atan2(xm, ym));
        }else{
          //Tampoco lo he cambiado #real
          Q1 = math.re(math.atan2(-xm,-ym));
        }
                      
      }else{
        //Ni idea #real
        Q1 = math.re(math.atan2(ym,xm));
      }  
    }    */
    Q1 = math.re(math.atan2(ym,xm));
    //console.log("Q1",Q1)
    //Para q1
    let q1=angles_map.q1
    //console.log("q1",q1) //marca -5 en lugar de 0 

    q1=qlimit(limits_map.q1,q1);
    //Para q2
    let hip=math.sqrt(math.pow(xm,2)+math.pow((zm-l1),2));
    //console.log("zm",zm)
    //console.log("l1",l1)
    //console.log("xm",xm)
    //console.log("hip", hip)
    let phi = math.complex(math.atan2(zm-l1, xm))
    //console.log("phi",phi)

    //beta=acos((-l3^2+l2^2+hip^2)/(2*l2*hip))
    let beta=math.acos((math.pow(l2,2)+math.pow(hip,2)-math.pow(l3,2))/(2*l2*hip)); //da negativo cuando no funciona 
    let Q2=math.add(phi,beta).re;//math.re(phi+beta);
    let q2=rad2deg(Q2) 
    //console.log("beta",beta)
    //console.log("Q2",Q2)
    //console.log("q2",q2)
    q2=qlimit(limits_map.q2,q2);
    //Para q3  
    let gamma=math.re(math.acos((math.pow(l2,2)+math.pow(l3,2)-math.pow(hip,2))/(2*l2*l3)));   
    let Q3=math.re(gamma-math.pi);
    let q3=rad2deg(Q3);
    q3=qlimit(limits_map.q3,q3);
    //console.log("gamma",gamma)
  //  console.log("Q3",Q3)
    //console.log("q3",q3)

    let q4 = phi_int - q2 -q3;
    q4=qlimit(limits_map.q4,q4);
    values_map.joint4 = q4+q2+q3;

    
    let acum = deg2rad(q2);
    let x2 = l2*math.cos(acum);
    let y2 = l2*math.sin(acum);
    acum+=deg2rad(q3);
    let x3 = x2+l3*math.cos(acum);
    let y3 = y2+l3*math.sin(acum);
    acum+=deg2rad(q4);
    let x4 = x3+l4*math.cos(acum);
    let y4 = y3+l4*math.sin(acum);
    //console.log(y4); //NAN
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
function StartGraphic(){
    inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
    go_rotation(values_map.joint2);
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

