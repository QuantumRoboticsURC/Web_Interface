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
    x: 0.2,   //.4
    y: 0,      //.9
    z: 0.2,
    phi: 0,      //phi
    rotacion: 0,   //rotacion
    joint8: 80, //camera
    led:0,
    joint9: 45
};
var l1 = 0.1;
var l2 = 0.43;
var l3 = 0.43;
var l4 = 0.213;

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
    q4:-50,
    q5: 0
};
var limit_z = -4.2;
var limit_chassis = 1.1; //11cm del chasis

// Predefined positions
var State = ["HOME","HOME"]
function predefinedPosition(position){
    
    //Se actualizan los valores del ValuesMap para la posicion predefinida seleccionada
    if (position === "HOME"){
        values_map.x = 0.2;
        values_map.y =  0;
        values_map.z =  0.2;
        values_map.rotacion = 0;
        values_map.phi = 0;
        
    } 
    else if(position === "INTERMEDIATE"){
        values_map.x = 0.2;
        values_map.y =  0;
        values_map.z =  0.4;
        values_map.rotacion = 0;
        values_map.phi = 0;        
    }
    else if (position === "PREFLOOR"){
        values_map.x = 0.3;
        values_map.y =  0;
        values_map.z =  -0.1;
        values_map.rotacion = 0;
        values_map.phi = -90; 
    }

    else if (position === "FLOOR"){
        values_map.x = 0.4;
        values_map.y =  0;
        values_map.z =  -0.2;
        values_map.rotacion = 0;
        values_map.phi = -90; 
    }
    else if (position === "STORAGE"){
        values_map.x = 0;
        values_map.y =  0;
        values_map.z =  0.42;
        values_map.rotacion = 0;
        values_map.phi = 90; 

    }

    else if (position === "FlOOR2"){
        x=2.48;
        y=0;
        z=-1.2;
        phi=6.17;
    }

    updateAngles();
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


function radToDeg(rad) {
    return rad * (180 / Math.PI);
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

    const q3 = -Math.atan2(Math.sqrt(1 - d ** 2), d);
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

// Función para actualizar los ángulos que se van calculando
function updateAngles() {
    var limit = false
    //Se toman los valores del ValuesMap para hacer el movimiento 
    const x = values_map.x|| 0; 
    const y = values_map.y|| 0;
    const z = values_map.z|| 0;
    const roll = values_map.rotacion || 0;
    const pitch = values_map.phi|| 0;

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
    document.getElementById('angle-q5').textContent = `${angles.q5.toFixed(2)}°`;

    document.getElementById("X").innerHTML = x.toFixed(2);
    document.getElementById("Y").innerHTML = y.toFixed(2);
    document.getElementById("Z").innerHTML = z.toFixed(2);
    document.getElementById("Roll").innerHTML = roll.toFixed(2);
    document.getElementById("Pitch").innerHTML = pitch.toFixed(2);
    //document.getElementById("Camera").innerHTML = Camera;
    //document.getElementById("CameraA").innerHTML = CameraA;

    // Actualizar la gráfica del brazo
    arm_interface(angles.q2, angles.q3, angles.q4);
}

//Para actualozar los valores en la barra del input
function adjustValue(id, delta) {
    
    const currentValue = values_map[id];
    const newValue = currentValue + delta;
    values_map[id] = newValue; // Asegura que el valor tenga 2 decimales
    console.log(`Adjusting value of ${id}: ${currentValue} -> ${newValue}`);
    //Checa si el neuvo valor se va a salir del rango del brazo
    if (Math.sqrt(values_map.x**2+values_map.y**2+values_map.z**2)>l1+l2+l3+l4){
        values_map[id] = currentValue
    }

    //input.dispatchEvent(new Event('input')); // Forzar la actualización
    updateAngles();

}


// Función para la interfaz gráfica del brazo
  function arm_interface(q2, q3, q4) {
    // Transformación a coordenadas rectangulares
    let acum = deg2rad(q2);
    let x2 = l2 * Math.cos(acum);
    let y2 = l2 * Math.sin(acum)+0.1;
    acum += deg2rad(q3);
    let x3 = x2 + l3 * Math.cos(acum);
    let y3 = y2 + l3 * Math.sin(acum);
    acum += deg2rad(q4);
    let x4 = x3 + l4 * Math.cos(acum);
    let y4 = y3 + l4 * Math.sin(acum);

    // Rango dinámico para ejes
    let maxReach = 1.2;

    // Crear o actualizar la gráfica
    if (window.armChart) {
        // Actualizar datos si ya existe la gráfica
        armChart.data.datasets[0].data = [
            { x: 0, y: 0.1 },
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
        armChart.options.scales.yAxes[0].ticks.min = -maxReach/2;
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
                        { x: 0, y: 0.1 },
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
                            stepSize: 0.1,
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
                            stepSize: 0.1,
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
