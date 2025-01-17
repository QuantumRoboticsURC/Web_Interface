var ros;
var robot_IP;
var bot;
//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});
//Camera
//if (_config.is_WebVideo){
  //  var topic = _config.topic_Arm_Camera;
  //  var src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + topic + "&type=ros_compressed";
  //  document.getElementById("Arm_Camera").src = src; 
//} else {
 //   var listener = new ROSLIB.Topic({
 //       ros : ros,
 //       name : _config.topic_Arm_Camera + '/compressed',
 //       messageType : 'sensor_msgs/CompressedImage'
 //   });

 //   listener.subscribe(function(message) {
 //       var imagedata = "data:image/png;base64," + message.data;
 //       document.getElementById("Arm_Camera").src = imagedata;
 //   });
//}  

//Joystick
var listener_Joystick = new ROSLIB.Topic({
    ros : ros,
    name : '/goal',
    messageType : 'std_msgs/String'
});



listener_Joystick.subscribe(function(message) {
  values = message.data.split(" ");
  if (values[0]!=0 || values[1]!=0 || values[2]!=0 || values[3]!=0.0 || values[4]!=-0.0 || values[5]!=0.0|| values[6]!=0.0){
    console.log("entra a if_")
  values_map.joint1 += parseFloat(values[0]);  //x
  values_map.joint2 += parseFloat(values[1]); //y
  values_map.joint3 += parseFloat(values[2]); //z
  values_map.joint4 += parseFloat(values[3]); //phi
  values_map.joint5 += parseFloat(values[4]); //gripper rotation
  values_map.joint8 += parseFloat(values[5]); // camera
  values_map.joint5=qlimit(limits_map["joint5"], values_map["joint5"]);
  values_map.joint8=qlimit(limits_map.camera, values_map["joint8"]);
  if(values[4]!=0){
    var msn = new ROSLIB.Message({
        data : parseInt(my_map(-90,90,138,312,values_map["joint5"]))});
       joint5.publish(msn); 
  }
  if(values[5]!=0){
    var msn2 = new ROSLIB.Message({data : parseFloat(my_map(90,140,0,180,values_map["joint8"]))});
    camera.publish(msn2);
  }
  go_rotation(values_map.joint2);
  getTxt();
} 
if(bot){
    var msn = new ROSLIB.Message({data : parseFloat(values[6])});
    lineal.publish(msn);
}



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
    name : 'arm_teleop/joint2_unprocessed',
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
    name : 'arm_teleop/joint5',
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
    name : 'arm_teleop/servo_gripper',
    messageType : 'std_msgs/Int32',
    queue_size: 1   
});
//lineal 
var gripper = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/prism',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
//lineal 
var lineal = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/gripper',
    messageType : 'std_msgs/Float64',
    queue_size: 1   
});
//Camera 
var camera = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/cam',
    messageType : 'std_msgs/Int32',
    queue_size: 1   
});
var cameraA = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/camA',
    messageType : 'std_msgs/Int32',
    queue_size: 1   
});

var emergency = new ROSLIB.Topic({
    ros : ros,
    name : 'arm_teleop/emergency',
    messageType : 'std_msgs/Bool',
    queue_size: 1
});

//Initial values
var gripper_apertur = 60;   //0 y 60

var values_map = {
    joint1: 0,   //.4
    joint2: 190,      //.9
    joint3: -140,
    joint4: -50,      //phi
    joint5: 0,   //rotacion
    joint8: 80, //camera
    led:0,
    joint9: 45
};
var l1 = 0;
var l2 = 2.6;
var l3 = 5.5;
var l4 = 1.7;

//Limits
var limits_map = {
    q1:[-90,90],
    q2:[0,190],
    q3:[-140,0],
    q4:[-135,90],
    joint5:[-90,90], 
    camera:[0,180],
    cameraA:[0,180]
};

var angles_map={
    q1:0,
    q2:190,
    q3:-140,
    q4:-50
};
var limit_z = -4.2;
var limit_chassis = 1.1; //11cm del chasis

// Predefined positions
var State = ["HOME","HOME"]
function predefinedPosition(position){

    var x = angles_map.q1;
    var y = angles_map.q2;
    var z = angles_map.q3;
    var phi = angles_map.q4;
    
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
    before = State[0];
    State[0] = State[1];
    State[1]=position;

    if (position === "HOME"){
        x = 0;
        y =  190;
        z =  -140;
        phi = -50;
        
    } 
    else if(position === "INTERMEDIATE"){
        x = 0;
        y = 155;
        z = -125;
        phi = -30;
        
    }
    else if (position === "FLOOR"){
        x=0;
        y=100;
        z=-130;
        phi=-60;
        
    }
    else if (position === "STORAGE"){
        x = 90;
        y = 180;
        z = -115;
        phi = -65;
        
    }
    else if (position === "FlOOR2"){
        x=2.48;
        y=0;
        z=-1.2;
        phi=6.17;
    }

    values_map.joint1 = x;
    values_map.joint2 = y;
    values_map.joint3 = z;
    values_map.joint4 = phi;
    angles_map.q1 = x;
    angles_map.q2 = y;
    angles_map.q3 = z;
    angles_map.q4 = phi;
    //StateMachine(position);
    //return position;
            
    go_rotation(values_map.joint2);
    getTxt();
    }
function StateMachine(position){
        
    const secondaryButton1 = document.getElementById('secondary button1');
    const secondaryButton2 = document.getElementById('secondary button2');
    const secondaryButton3 = document.getElementById('secondary button3');
    const secondaryButton4 = document.getElementById('secondary button4');
    const secondaryButton5 = document.getElementById('secondary button5');
    const secondaryButton6 = document.getElementById('secondary button6');

    const buttonToKeepEnabled = document.getElementById('principal button');

    if ((State[0] === "INTERMEDIATE" && State[1]==="HOME" || State[1] === "INTERMEDIATE" && State[0]==="HOME")){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        
        secondaryButton3.disabled = false;
        secondaryButton4.disabled = false;
        secondaryButton5.disabled = false;
        secondaryButton6.disabled = false;
    }
    if (State[1]=== "HOME"){
        
        secondaryButton3.disabled = true;
        secondaryButton4.disabled = true;
        secondaryButton5.disabled = true;
        secondaryButton6.disabled = true;

    }
    if (State[0] === "INTERMEDIATE" && State[1]==="INTERMEDIATE" || State[1] === "INTERMEDIATE" && State[0]==="INTERMEDIATE"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        
    }
    
    if (State[0] === "INTERMEDIATE" && State[1]==="PULL" || State[1] === "INTERMEDIATE" && State[0]==="PULL"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        secondaryButton1.disabled = false;
        secondaryButton2.disabled = false;
        secondaryButton4.disabled = false;
        secondaryButton5.disabled = false;
        secondaryButton6.disabled = false;
        
    }
    if (State[1]=== "PULL"){
        secondaryButton1.disabled = true;
        secondaryButton2.disabled = true;
        secondaryButton4.disabled = true;
        secondaryButton5.disabled = true;
        secondaryButton6.disabled = true;

    }
    if (State[0] === "INTERMEDIATE" && State[1]==="WRITE" || State[1] === "INTERMEDIATE" && State[0]==="WRITE"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        secondaryButton1.disabled = false;
        secondaryButton2.disabled = false;
        secondaryButton3.disabled = false;
        secondaryButton5.disabled = false;
        secondaryButton6.disabled = false;
        
    }
    if (State[1]=== "WRITE"){
        secondaryButton1.disabled = true;
        secondaryButton2.disabled = true;
        secondaryButton3.disabled = true;
        secondaryButton5.disabled = true;
        secondaryButton6.disabled = true;

    }
    if (State[0] === "INTERMEDIATE" && State[1]==="FLOOR" || State[1] === "INTERMEDIATE" && State[0]==="FLOOR"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        secondaryButton1.disabled = false;
        secondaryButton2.disabled = false;
        secondaryButton3.disabled = false;
        secondaryButton4.disabled = false;
        secondaryButton6.disabled = false;
    }
    if (State[1]=== "FLOOR"){
        secondaryButton1.disabled = true;
        secondaryButton2.disabled = true;
        secondaryButton3.disabled = true;
        secondaryButton4.disabled = true;
        secondaryButton6.disabled = true;

    }
    if (State[0] === "INTERMEDIATE" && State[1]==="STORAGE" || State[1] === "INTERMEDIATE" && State[0]==="STORAGE"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        
        secondaryButton3.disabled = false;
        secondaryButton4.disabled = false;
        secondaryButton5.disabled = false;
        secondaryButton6.disabled = false;
    }
    
    if (State[1]=== "STORAGE"){
        
        secondaryButton3.disabled = true;
        secondaryButton4.disabled = true;
        secondaryButton5.disabled = true;
        secondaryButton6.disabled = true;

    }
    if (State[0] === "INTERMEDIATE" && State[1]==="VERTICAL" || State[1] === "INTERMEDIATE" && State[0]==="VERTICAL"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
        secondaryButton1.disabled = false;
        secondaryButton2.disabled = false;
        secondaryButton3.disabled = false;
        secondaryButton4.disabled = false;
        secondaryButton5.disabled = false;
    }
    if (State[1]=== "VERTICAL"){
        secondaryButton1.disabled = true;
        secondaryButton2.disabled = true;
        secondaryButton3.disabled = true;
        secondaryButton4.disabled = true;
        secondaryButton5.disabled = true;

    }
    if (State[0]==="HOME" && State[1]==="STORAGE" || State [1]=== "HOME" && State[0]==="STORAGE"){
        inverseKinematics(values_map.joint1, values_map.joint2, values_map.joint3, values_map.joint4);        
        go_rotation(values_map.joint2);
    
    }
    console.log(State[0]);
    console.log(State[1]);

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
    var msn_q4 = new ROSLIB.Message({data : -q4});
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
    angles_map.q4 =data;
    angles_map.q4 = qlimit(limits_map.q4,angles_map.q4);
    values_map.joint4 = self.angles_map.q4;
    getTxt();
}


// 
function phi(data){
    angles_map.q4+=data;
    angles_map.q4 = qlimit(limits_map.q4,angles_map.q4);
    values_map.joint4 = self.angles_map.q4;
    getTxt();
}

// Z momento
function go_z(data) {
    angles_map.q3 = data; // Asignar el valor absoluto
    angles_map.q3 = qlimit(limits_map.q3, angles_map.q3); // Aplicar límites
    values_map.joint3 = self.angles_map.q3; // Actualizar en el mapa de valores
    getTxt(); // Actualizar la interfaz y publicar
}

function z(data) {
    angles_map.q3 += data; // Incrementar o decrementar el valor
    angles_map.q3 = qlimit(limits_map.q3, angles_map.q3); // Aplicar límites
    values_map.joint3 = angles_map.q3; // Actualizar en el mapa de valores
    getTxt(); // Actualizar la interfaz y publicar
}


// Gripper go to particular location
function go(data){
    var key = "joint5";
    values_map[key]=data;
    values_map[key] = qlimit(limits_map[key], values_map[key]);
    var msn = new ROSLIB.Message({data : parseInt(my_map(-90,90,135,315,data))});
    joint5.publish(msn);
    document.getElementById("Gripper_Txt").value = 5;
    getTxt();
}

// Rotate gripper N grades
function griperRotation(data){
    var key = "joint5";
    values_map[key]+=data;
    values_map[key] = qlimit(limits_map[key], values_map[key]);
    var msn = new ROSLIB.Message({
        data : parseInt(my_map(-90,90,135,315,values_map[key]))
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
    if(data==1 || data==-1){
        bot = false;
    }else{
        bot=true;
    }
    var msn = new ROSLIB.Message({data : data});
    lineal.publish(msn);
    

}

// Move general camera
function moveCamera(data,cam){

    if(cam==1){
        console.log(data);
        key = "joint8";
        values_map[key] += (data);    
        values_map[key] = qlimit(limits_map.camera, values_map[key]);
        var msn = new ROSLIB.Message({data : parseInt(values_map[key])});
        camera.publish(msn);
    }else{
        key="joint9";
        values_map[key] += (data);    
        values_map[key] = qlimit(limits_map.cameraA, values_map[key]);
        var msn = new ROSLIB.Message({data : parseInt(values_map[key])});
        cameraA.publish(msn);
    }

    getTxt();
}

//Rotate
function go_rotation(data){
    angles_map.q2=data;
    angles_map.q2 = qlimit(limits_map.q2,angles_map.q2);
    values_map.joint2 = self.angles_map.q2;
    document.getElementById("Y_Txt").value = 5;

    getTxt();
}


//Rotate
function rotate(data){
    angles_map.q2+=data;
    angles_map.q2 = qlimit(limits_map.q2,angles_map.q2);
    values_map.joint2 = self.angles_map.q2;
    getTxt();
}

function Emergency(data){
    console.log(data)
    var msn = new ROSLIB.Message({data:true})
    emergency.publish(msn);
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
    var CameraA=String(values_map.joint9);


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
    localStorage.setItem("CameraA",CameraA)
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
    document.getElementById("CameraA").innerHTML = CameraA;
    arm_interface(q2,q3,q4)

}

function rad2deg(radians){return radians * (180/math.pi);}
function deg2rad(degrees){return degrees * (math.pi/180);}
// Función para convertir radianes a grados
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

// Función para convertir grados a radianes
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Función de cinemática inversa
function inverseKinematics(x, y, z, roll, pitch) {
    const l1 = 0.10;
    const l2 = 0.43;
    const l3 = 0.43;
    const l4 = 0.213;

    const q1 = Math.atan2(y, x);
    const q5 = roll;

    const a = Math.sqrt(x ** 2 + y ** 2) - l4 * Math.cos(pitch);
    const b = z - (l4 * Math.sin(pitch)) - l1;

    let d = (a ** 2 + b ** 2 - l2 ** 2 - l3 ** 2) / (2 * l2 * l3);
    d = Math.max(-1, Math.min(1, d)); // Clamping para evitar errores numéricos

    const q3 = Math.atan2(Math.sqrt(1 - d ** 2), d);
    const q2 = Math.atan2(b, a) - Math.atan2(l3 * Math.sin(q3), l2 + l3 * Math.cos(q3));
    const q4 = pitch - q2 - q3;

    return {
        q1: radToDeg(q1),
        q2: radToDeg(q2),
        q3: radToDeg(q3),
        q4: radToDeg(q4),
        q5: radToDeg(q5),
    };
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// Función para actualizar los ángulos que se van calculando
function updateAngles() {
    const x = parseFloat(document.getElementById('cinematic-x').value) || 0;
    const y = parseFloat(document.getElementById('cinematic-y').value) || 0;
    const z = parseFloat(document.getElementById('cinematic-z').value) || 0;
    const roll = parseFloat(document.getElementById('cinematic-roll').value) || 0;
    const pitch = parseFloat(document.getElementById('cinematic-pitch').value) || 0;

    console.log(`Updating angles with: x=${x}, y=${y}, z=${z}, roll=${roll}, pitch=${pitch}`);

    // Convertir roll y pitch a radianes
    const rollRad = (roll * Math.PI) / 180;
    const pitchRad = (pitch * Math.PI) / 180;

    // Llamar a la función de cinemática inversa
    const angles = inverseKinematics(x, y, z, rollRad, pitchRad);

    // Actualizar los valores de los ángulos en el HTML
    document.getElementById('angle-q1').textContent = `${angles.q1.toFixed(2)}°`;
    document.getElementById('angle-q2').textContent = `${angles.q2.toFixed(2)}°`;
    document.getElementById('angle-q3').textContent = `${angles.q3.toFixed(2)}°`;
    document.getElementById('angle-q4').textContent = `${angles.q4.toFixed(2)}°`;

    // Actualizar la gráfica del brazo
    arm_interface(angles.q2, angles.q3, angles.q4);
}

//Para actualozar los valores en la barra del input
function adjustValue(id, delta) {
    const input = document.getElementById(id);
    const currentValue = parseFloat(input.value) || 0;
    const newValue = currentValue + delta;
    input.value = newValue.toFixed(0); // Asegura que el valor tenga 2 decimales
    console.log(`Adjusting value of ${id}: ${currentValue} -> ${newValue}`);
    input.dispatchEvent(new Event('input')); // Forzar la actualización
}

// Función para publicar los ángulos en ROS
function publish_angles() {
    const msn_q1 = new ROSLIB.Message({ data: angles_map.q1 });
    const msn_q2 = new ROSLIB.Message({ data: angles_map.q2 });
    const msn_q3 = new ROSLIB.Message({ data: angles_map.q3 });
    const msn_q4 = new ROSLIB.Message({ data: angles_map.q4 });
    const msn_txt = new ROSLIB.Message({
        data: `${angles_map.q1} ${angles_map.q2} ${angles_map.q3} ${angles_map.q4}`,
    });

    pub_q1.publish(msn_q1);
    pub_q2.publish(msn_q2);
    pub_q3.publish(msn_q3);
    pub_q4.publish(msn_q4);
    pub_q_string.publish(msn_txt);
}

// Función de cinemática inversa vieja 
/*function inverseKinematics(xm, ym, zm, phi_int){
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
    }    
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
    
  } */
 
// Función para la interfaz gráfica del brazo
  function arm_interface(q2, q3, q4) {
    // Transformación a coordenadas rectangulares
    let acum = deg2rad(q2);
    let x2 = l2 * Math.cos(acum);
    let y2 = l2 * Math.sin(acum);
    acum += deg2rad(q3);
    let x3 = x2 + l3 * Math.cos(acum);
    let y3 = y2 + l3 * Math.sin(acum);
    acum += deg2rad(q4);
    let x4 = x3 + l4 * Math.cos(acum);
    let y4 = y3 + l4 * Math.sin(acum);

    // Rango dinámico para ejes
    let maxReach = Math.max(Math.abs(x4), Math.abs(y4)) + 2;

    // Crear o actualizar la gráfica
    if (window.armChart) {
        // Actualizar datos si ya existe la gráfica
        armChart.data.datasets[0].data = [
            { x: 0, y: 0 },
            { x: x2, y: y2 }
        ];
        armChart.data.datasets[1].data = [
            { x: x2, y: y2 },
            { x: x3, y: y3 }
        ];
        armChart.data.datasets[2].data = [
            { x: x3, y: y3 },
            { x: x4, y: y4 }
        ];
        armChart.options.scales.xAxes[0].ticks.min = -maxReach;
        armChart.options.scales.xAxes[0].ticks.max = maxReach;
        armChart.options.scales.yAxes[0].ticks.min = -maxReach;
        armChart.options.scales.yAxes[0].ticks.max = maxReach;
        armChart.update();
    } else {
        // Crear nueva gráfica si no existe
        var armData = {
            labels: [],
            datasets: [
                {
                    label: "Joint 2",
                    data: [
                        { x: 0, y: 0 },
                        { x: x2, y: y2 }
                    ],
                    lineTension: 0, // Línea recta
                    fill: false,
                    borderColor: 'blue',
                    borderWidth: 3,
                    pointBorderColor: 'blue',
                    pointBackgroundColor: 'blue',
                    pointRadius: 6,
                    pointStyle: 'circle',
                    showLine: true
                },
                {
                    label: "Joint 3",
                    data: [
                        { x: x2, y: y2 },
                        { x: x3, y: y3 }
                    ],
                    lineTension: 0,
                    fill: false,
                    borderColor: 'red',
                    borderWidth: 3,
                    pointBorderColor: 'red',
                    pointBackgroundColor: 'red',
                    pointRadius: 6,
                    pointStyle: 'circle',
                    showLine: true
                },
                {
                    label: "Joint 4",
                    data: [
                        { x: x3, y: y3 },
                        { x: x4, y: y4 }
                    ],
                    lineTension: 0,
                    fill: false,
                    borderColor: 'green',
                    borderWidth: 3,
                    pointBorderColor: 'green',
                    pointBackgroundColor: 'green',
                    pointRadius: 6,
                    pointStyle: 'circle',
                    showLine: true
                }
            ]
        };

        var chartOptions = {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontColor: 'black',
                    fontSize: 14
                }
            },
            
            scales: {
                xAxes: [
                    {
                        ticks: {
                            min: -maxReach,
                            max: maxReach,
                            stepSize: 1,
                            fontSize: 12
                        },
                        gridLines: {
                            color: 'rgba(200, 200, 200, 0.5)'
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            min: -maxReach,
                            max: maxReach,
                            stepSize: 1,
                            fontSize: 12
                        },
                        gridLines: {
                            color: 'rgba(200, 200, 200, 0.5)'
                        }
                    }
                ]
            },
            animation: {
                duration: 0 // Sin animación
            }
        };

        window.armChart = new Chart("Arm_Graphic", {
            type: "scatter",
            data: armData,
            options: chartOptions
        });
    }
}

// Función para convertir grados a radianes
function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}
