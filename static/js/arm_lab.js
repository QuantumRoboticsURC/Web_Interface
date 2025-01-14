var ros;
var robot_IP;
var ledstate = false;
//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
}); 



  
class ArmTeleop{
    constructor(){
        this.labmechanism = new ROSLIB.Topic({
            ros:ros,
            name:'/science/elevator',
            messageType: 'std_msgs/Int8',
            queue_size:10

        })
        this.servoright = new ROSLIB.Topic({
            ros:ros,
            name:'science/servos2',
            messageType: 'std_msgs/Int8',
            queue_size:1
        });
        this.servocenter = new ROSLIB.Topic({
            ros:ros,
            name:'servo_center',
            messageType: 'std_msgs/Int8',
            queue_size:1
        });
    
        this.joint3 = new ROSLIB.Topic({
            ros:ros,
            name:'arm_teleop/joint3',
            messageType: 'std_msgs/Float64',
            queue_size:1
        });
        this.joint1= new ROSLIB.Topic({
            ros: ros,
            
            name: 'arm_teleop/joint1',
            messageType: 'std_msgs/Float64',
            queue_size:1
        })
        this.joint2= new ROSLIB.Topic({
            ros: ros,
            name: 'arm_teleop/joint2_unprocessed',
            messageType: 'std_msgs/Float64',
            queue_size:1
        });
        this.camera = new ROSLIB.Topic({
            ros : ros,
            name : 'arm_teleop/cam',
            messageType : 'std_msgs/Int8',
            queue_size: 1 //  
        });
        this.servoleft= new ROSLIB.Topic({
            ros : ros,
            name : 'science/servos1',
            messageType : 'std_msgs/Int8',
            queue_size: 1  
        });
        //Leds
        this.pub_led = new ROSLIB.Topic({
            ros : ros,
            name : 'status_led',
            messageType : 'std_msgs/Bool',
            queue_size: 1   
        });
        this.cameraA = new ROSLIB.Topic({
            ros : ros,
            name : 'ciencias/cam',
            messageType : 'std_msgs/Int8',
            queue_size: 1   
        });
        this.Drill = new ROSLIB.Topic({
            ros : ros,
            name : 'science/drill',
            messageType : 'std_msgs/Int8',
            queue_size: 1
        })
       

        this.limits_map = {
            q1:[-90,90],
            q2:[0,190],
            q3:[-125,0], //Cambio de límites
            q4: [0,180],
            q5: [0,180],
            q6: [-1,1],
            q7: [-1,1],
            q8: [0,1]
            
            
        }
        this.angles_map={
            q1:0.0,
            q2:190.0,
            q3:-125.0,
            q4:0.0,
            q5:90.0,
            q6:0.0,
            q7:0.0,
            q8:0.0
            
        }
        this.led = false;  
    }
    led_signal(data){
        console.log(data)
        ledstate=data;
        this.led = data
        var msn = new ROSLIB.Message({data:data})
        this.pub_led.publish(msn)
        var LED = String(this.led);
        localStorage.setItem("LED",LED);
        document.getElementById("LED").innerHTML = LED;

        //getTxt();
    }
    publishMessages(){
        
        this.angles_map.q1=qlimit(this.limits_map.q1,this.angles_map.q1)
        this.angles_map.q2=qlimit(this.limits_map.q2,this.angles_map.q2)
        this.angles_map.q3=qlimit(this.limits_map.q3,this.angles_map.q3)
        this.angles_map.q4=qlimit(this.limits_map.q4,this.angles_map.q4)
        this.angles_map.q5=qlimit(this.limits_map.q5,this.angles_map.q5)
        this.angles_map.q6=qlimit(this.limits_map.q6,this.angles_map.q6)
        this.angles_map.q7=qlimit(this.limits_map.q7,this.angles_map.q7)



        var message = new ROSLIB.Message({
            joint3:my_map(-162,0,330,492,this.angles_map.q3),
            servo1:this.angles_map.q4,
            servo2:this.angles_map.q5,
            servo3:this.angles_map.q6,
            centrifuga:this.angles_map.q7,
            screenshot:"a"

        });
        var message2 =new ROSLIB.Message({
            data:this.angles_map.q1
        })
        var message3=new ROSLIB.Message({
            data:this.angles_map.q2
        })
        var message4 = new ROSLIB.Message({
            data:this.angles_map.q3
        });
        var message5 = new ROSLIB.Message({
            data:this.angles_map.q6
        });
        var message6 = new ROSLIB.Message({
            data:this.angles_map.q5
        });
        var message7 = new ROSLIB.Message({
            data:this.angles_map.q4
        });
        var message8 = new ROSLIB.Message({
            data:this.angles_map.q7
        })
        
        this.joint3.publish(message4);
        //this.arm.publish(message);
        this.joint1.publish(message2);
        this.joint2.publish(message3);
        this.servoright.publish(message5);
        this.servocenter.publish(message7);
        this.servoleft.publish(message8);
        //this.cameraA.publish(message9);
        //this.labmechanism.publish(mesage10)
        //this.drill.publish(mesage11)
        //this.Servo_right.publish(message12)
        //this.Servo_left.publish(message13)

        if(ledstate){
            console.log(ledstate)
            var msn = new ROSLIB.Message({data:false})
            this.pub_led.publish(msn)
            ledstate= false;
        }
    }
     my_map(in_min, in_max, out_min, out_max, x){ //map arduino
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    servo_posicion(num_garra,pos){
        console.log(pos);
        if (num_garra ==1){
                
            this.angles_map.q6=pos;
                
            }
        else{
            this.angles_map.q7=pos;
    
        }
        getTxt();
    }
    Up_Down (valor){

        var message = new ROSLIB.Message({data: valor});
        this.labmechanism.publish(message);
        console.log(valor);
    
    }
    }
let arm = new ArmTeleop();

var l2=3.5;
var l3=2.5;

var state = ["HOME" , "HOME"];

function predefinedPosition(position){
    before = state[0];
    state[0] = state[1];
    state[1]=position;

    switch(position){
        case "HOME":
            arm.angles_map.q1=0;
            arm.angles_map.q2=190;
            arm.angles_map.q3=-125;
            break;
        case "INTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=140;
            arm.angles_map.q3=-125;
            break
        case "GROUND":
            arm.angles_map.q1=0;
            arm.angles_map.q2=15;
            arm.angles_map.q3=-90;
            break
        case "GROUNDINTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=45;
            arm.angles_map.q3=-35;
            break
        case "SECONDINT":
                arm.angles_map.q1=90;
                arm.angles_map.q2=60;
                arm.angles_map.q3=400;
            break
        case "SERVOSTEP":
            arm.angles_map.q1=90;
            arm.angles_map.q2=130;
            arm.angles_map.q3=340;
            break
        case "LEFT":
            arm.angles_map.q1=170;
            arm.angles_map.q2=106;
            arm.angles_map.q3=331;
            break
        case "CENTER":
            arm.angles_map.q1=148;
            arm.angles_map.q2=103;
            arm.angles_map.q3=336;
            break
        case "RIGHT":
            arm.angles_map.q1=125;
            arm.angles_map.q2=108;
            arm.angles_map.q3=330;
    }
    StateMachine(position);
    return position;
}

function StateMachine(position){

    const boton1 = document.getElementById("button1");
    const boton2 = document.getElementById("button2");
    const boton3 = document.getElementById("button3");
    const boton4 = document.getElementById("button4");

    if (state[1] === "HOME"){
        getTxt();
        boton2.disabled = false;
        boton3.disabled = true;
        boton4.disabled = true;
    }

    if (state[1] === "INTERMEDIATE"){
        getTxt();
        boton1.disabled = false;
        boton3.disabled = false;
        boton4.disabled = true;
    }

    if (state[1] === "GROUNDINTERMEDIATE"){
        getTxt();
        boton1.disabled = true;
        boton2.disabled = false;
        boton4.disabled = false;
    }

    if(state[1] === "GROUND"){
        getTxt();
        boton1.disabled = true;
        boton2.disabled = true;
        boton3.disabled = false;
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
function go(data,q){
    switch(q){
        case 1:
            arm.angles_map.q1=(arm.limits_map.q1,data);
            //document.getElementById("X_Txt").value = 5;
            
            break;
        case 2:
            arm.angles_map.q2=(arm.limits_map.q2,data);
            //document.getElementById("Y_Txt").value = 5;
            break;
        case 3:
            arm.angles_map.q3=(arm.limits_map.q3,data);
            //document.getElementById("Axis3_Txt").value = 5;
            break;
        case 4:
            arm.angles_map.q4=(arm.limits_map.q4,data);
            break;
        case 5:
            arm.angles_map.q5=(arm.limits_map.q5,data);
            document.getElementById("Center_Txt").value = 5;
            break;
        case 6:
            arm.angles_map.q6=(arm.limits_map.q6,data);
            document.getElementById("Right_Txt").value = 5;
            break;
    }
    getTxt();
}
 function move_rotation(data, sign=1){
    arm.angles_map.q1+=data*sign;
    getTxt();
}
function move_yellow(data, sign=1){
    arm.angles_map.q2+=data*sign;
    getTxt();
}
function move_joint3(data, sign=1){
    arm.angles_map.q3+=data*sign;
    getTxt();
}
function move_joint4(data){
    arm.angles_map.q4=data;
    getTxt();
}
function moveCentrifuge(data){
    arm.angles_map.q7=data;
    getTxt();
}
function change_led(data){
    arm.led_signal(data);
    //getTxt();
}
function moveServos(id, sim, data){
    if (id == 5){
        if (sim == "+"){
            console.log(data);
            arm.angles_map.q5 += data;
        } else{
            arm.angles_map.q5 -= data;
        }
        getTxt();
    }
}


function taladro(option){
    if (option == 1){
        console.log("On")
    }
    else{
        console.log("Off")
    }
    arm.Drill.publish(new ROSLIB.Message({data:option}));
    console.log(option);
    arm.angles_map.q8=option;
    getTxt();
    
}


    
    //else {
       // switch (pos) {
            //case 1: 
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //break;
            
            //case 2:
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //break;
            
            //case 3:
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //arm.angles_map.q8=1;
                //arm.angles_map.q9=2;
                //break;
        //}

    //}
    //console.log(num_garra);
    
function getTxt() {
    arm.publishMessages();
    
    var Brazo_1 = String(arm.angles_map.q1);
    var Garra_1 = String(arm.angles_map.q2);
    var Brazo_2 = String(arm.angles_map.q3);
    var Garra_2 = String(arm.angles_map.q4);
    var Camera = String(arm.angles_map.q5);
    var Drill = String(arm.angles_map.q8)
    var Servo_left = String(arm.angles_map.q6)
    var Servo_right = String(arm.angles_map.q7)

    localStorage.setItem("Brazo 1", Brazo_1);
    localStorage.setItem("Garra 1",Garra_1);
    localStorage.setItem("Brazo 2", Brazo_2);
    localStorage.setItem("Garra 2", Garra_2);
    localStorage.setItem("Camera", Camera);
    localStorage.setItem("Drill", Drill);
    localStorage.setItem("servo_right", Servo_right);
    localStorage.setItem("Servo_left", Servo_left);
    

    //document.getElementById("Rotation").innerHTML = Brazo_1;
    //document.getElementById("YJ").innerHTML = Garra_1;
    //document.getElementById("Axis3").innerHTML = Brazo_2;
    document.getElementById("LS").innerHTML = Garra_2;
    document.getElementById("CS").innerHTML = Camera;
    switch(Drill){
        case "0":
            document.getElementById("RS").innerHTML = "Off";
            break;
        case "1":
            document.getElementById("RS").innerHTML = "On";
            break;
    }
    //document.getElementById("RS").innerHTML = Drill;
    switch(Servo_left){
        case "-1":
            document.getElementById("Centrifuge").innerHTML = "Open";
            break;
        case "0":
            document.getElementById("Centrifuge").innerHTML = "Gather";
            break;
        case "1":
            document.getElementById("Centrifuge").innerHTML = "Introduce Sample";
            break;
    }
    switch(Servo_right){
        case "-1":
            document.getElementById("LED").innerHTML = "Open";
            break;
        case "0":
            document.getElementById("LED").innerHTML = "Gather";
            break;
        case "1":
            document.getElementById("LED").innerHTML = "Introduce Sample";
            break;
    }
    /*document.getElementById("Centrifuge").innerHTML = Servo_left;
    document.getElementById("LED").innerHTML = Servo_right;*/
    arm_interface(arm.angles_map.q2,arm.angles_map.q3)

}
function arm_interface(q2,q3){    
	//Transformación a coordenadas rectangulares
    let acum = deg2rad(q2);
	let x2=l2*math.cos(acum);
	let y2=l2*math.sin(acum);
    var q3n=q3;
    acum+=deg2rad(q3n);
	let x3=x2+l3*math.cos(acum);
	let y3=y2+l3*math.sin(acum);    
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
  		}]
    };
}

    

function rad2deg(radians){return radians * (180/math.pi);}
function deg2rad(degrees){return degrees * (math.pi/180);}
function my_map(in_min, in_max, out_min, out_max, x){ //map arduino
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
