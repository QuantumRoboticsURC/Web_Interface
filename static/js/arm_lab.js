var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});
class ArmTeleop{
    constructor(){
        
        this.arm = new ROSLIB.Topic({
            ros: ros,
            name: 'arm_laboratory',
            messageType : 'lab_arm/arm_lab',
            queue_size:1
        });

        this.limits_map = {
            q1:[-180,0],
            q2:[-8,164],
            q3:[0,245], //Cambio de límites
            q4: [0,120],
            q5: [0,80],
            q6:[0,110],
            q7:[-10,10]
        }
        this.angles_map={
            q1:0.0,
            q2:90.0,
            q3:-155,
            q4:0,
            q5:0,
            q6:0,
            q7:0
        }  
    }
    publishMessages(){
        var message = new ROSLIB.Message({
            joint1:this.angles_map.q1,
            joint2:this.angles_map.q2,
            joint3:this.angles_map.q3,
            servo1:this.angles_map.q4,
            servo2:this.angles_map.q5,
            servo3:this.angles_map.q6,
            centrifuga:this.angles_map.q7,
            screenshot:"a"

        });
        this.arm.publish(message);
        console.log(message);
        
    }
        moveServo(servo_id,servo_dir,servo_step){
            switch(servo_id){
                case 1:
                    if(servo_dir=="+"){
                        var step = this.angles_map.q4+servo_step;
                    }
                    else{
                        var step = this.angles_map.q4-servo_step;
                    }
                    console.log(step);
                    if(step>=this.limits_map.q4[0] && step<=this.limits_map.q4[1]){
                        if(step<=this.limits_map.q4[0]){
                            this.angles_map.q4=this.limits_map.q4[0];
                        }
                        else if(step>=this.limits_map.q4[1]){
                            this.angles_map.q4=this.limits_map.q4[1];
                        }
                        else{
                            this.angles_map.q4=step;
                        }
                    }
                    break;
                case 2: 
                    if(servo_dir=="+"){
                        var step = this.angles_map.q5+servo_step;
                    }
                    else{
                        var step = this.angles_map.q5-servo_step;
                    }
                    if(step>=this.limits_map.q5[0] && step<=this.limits_map.q5[1]){
                        if(step<=this.limits_map.q5[0]){
                            this.angles_map.q5=this.limits_map.q5[0];
                        }
                        else if(step>=this.limits_map.q5[1]){
                            this.angles_map.q5=this.limits_map.q5[1];
                        }
                        else{
                            this.angles_map.q5=step;
                        }
                    }
                    break;
                case 3:
                        if(servo_dir=="+"){
                            var step = this.angles_map.q6+servo_step;
                        }
                        else{
                            var step = this.angles_map.q6-servo_step;
                        }
                        if(step>=this.limits_map.q6[0] && step<=this.limits_map.q6[1]){
                            if(step<=this.limits_map.q6[0]){
                                this.angles_map.q6=this.limits_map.q6[0];
                            }
                            else if(step>=this.limits_map.q6[1]){
                                this.angles_map.q6=this.limits_map.q6[1];
                            }
                            else{
                                this.angles_map.q6=step;
                            }
                        }
                    break;
                case 4:
                    if(servo_dir=="+"){
                        var step = this.angles_map.q3+servo_step;
                    }
                    else{
                        var step = this.angles_map.q3-servo_step;
                    }
                    if(step>=this.limits_map.q3[0] && step<=this.limits_map.q3[1]){
                        if(step<=this.limits_map.q3[0]){
                            this.angles_map.q6=this.limits_map.q3[0];
                        }
                        else if(step>=this.limits_map.q3[1]){
                            this.angles_map.q3=this.limits_map.q3[1];
                        }
                        else{
                            this.angles_map.q3=step;
                        }
                    }
                    break;
            }
    
        }
        

    }
let arm = new ArmTeleop();

var l2=2.4;
var l3=2;



function moveServos(servo_id,servo_dir,servo_step){
    arm.moveServo(servo_id,servo_dir,servo_step);
    getTxt();
}

function predefinedPosition(position){
    switch(position){
        case "HOME":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=0;
            break;
        case "INTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=65;
            break
        case "GROUND":
            arm.angles_map.q1=0;
            arm.angles_map.q2=-8;
            arm.angles_map.q3=94;
            break
        case "HORIZONTAL":
            arm.angles_map.q1=0;
            arm.angles_map.q2=0;
            arm.angles_map.q3=155;
            break
        case "LEFT":
            arm.angles_map.q1=-123;
            arm.angles_map.q2=139;
            arm.angles_map.q3=9;
            break
        case "CENTER":
            arm.angles_map.q1=-95;
            arm.angles_map.q2=155;
            arm.angles_map.q3=4;
            break
        case "RIGHT":
            arm.angles_map.q1=-149;
            arm.angles_map.q2=139;
            arm.angles_map.q3=14;  
    }
    getTxt();
    
}

function go_rotation(data){
    arm.angles_map.q1=data
    if (arm.angles_map.q1<arm.limits_map.q1[0]){
     arm.angles_map.q1=arm.limits_map.q1[0]
    }else if (arm.angles_map.q1>arm.limits_map.q1[1]){
     arm.angles_map.q1=arm.limits_map.q1[1]
    }
    getTxt();
}

function go_yellow(data){
    arm.angles_map.q2=data
    if (arm.angles_map.q2<arm.limits_map.q2[0]){
     arm.angles_map.q2=arm.limits_map.q2[0]
    }else if (arm.angles_map.q2>arm.limits_map.q2[1]){
     arm.angles_map.q2=arm.limits_map.q2[1]
    }
    getTxt();
}

function getTxt(){
    arm.publishMessages();
    var Rotation = String(arm.angles_map.q1);
    var YellowJacketAxis2 = String(arm.angles_map.q2);
    var ServoAxis3 = String(arm.angles_map.q3);
    var Servo_Left = String(arm.angles_map.q4);
    var Servo_Center = String(arm.angles_map.q5);
    var Servo_Right = String(arm.angles_map.q6);

  
    localStorage.setItem("Rotation",Rotation);
    localStorage.setItem("YJ",YellowJacketAxis2);
    localStorage.setItem("Axis3",ServoAxis3);
    localStorage.setItem("LS",Servo_Left);
    localStorage.setItem("CS",Servo_Center);
    localStorage.setItem("RS",Servo_Right);

    document.getElementById("Rotation").innerHTML = Rotation;
    document.getElementById("YJ").innerHTML = YellowJacketAxis2;
    document.getElementById("Axis3").innerHTML = ServoAxis3;
    document.getElementById("LS").innerHTML = Servo_Left;
    document.getElementById("CS").innerHTML = Servo_Center;
    document.getElementById("RS").innerHTML = Servo_Right;
  
}
function rad2deg(radians){return radians * (180/math.pi);}
 function deg2rad(degrees){return degrees * (math.pi/180);}
 function my_map(in_min, in_max, out_min, out_max, x){ //map arduino
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

 function arm_interface(q2,q3){    
	//Transformación a coordenadas rectangulares
    let acum = deg2rad(q2);
	let x2=l2*math.cos(acum);
	let y2=l2*math.sin(acum);
    var q3n=my_map(0,245,-155,90,q3);
    console.log(q3n)
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
function go_axis3_servo(data){
    arm.angles_map.q3=data
    if (arm.angles_map.q3<arm.limits_map.q3[0]){
     arm.angles_map.q3=arm.limits_map.q3[0]
    }else if (arm.angles_map.q3>arm.limits_map.q3[1]){
     arm.angles_map.q3=arm.limits_map.q3[1]
    }
    getTxt();
 }

function go_left_servo(data){
   arm.angles_map.q4=data
   if (arm.angles_map.q4<arm.limits_map.q4[0]){
    arm.angles_map.q4=arm.limits_map.q4[0]
   }else if (arm.angles_map.q4>arm.limits_map.q4[1]){
    arm.angles_map.q4=arm.limits_map.q4[1]
   }
   getTxt();
}

function go_center_servo(data){
    arm.angles_map.q5=data
    if (arm.angles_map.q5<arm.limits_map.q5[0]){
     arm.angles_map.q5=arm.limits_map.q5[0]
    }else if (arm.angles_map.q5>arm.limits_map.q5[1]){
     arm.angles_map.q5=arm.limits_map.q5[1]
    }
    getTxt();
 }

 function go_right_servo(data){
    arm.angles_map.q6=data
    if (arm.angles_map.q6<arm.limits_map.q6[0]){
     arm.angles_map.q6=arm.limits_map.q6[0]
    }else if (arm.angles_map.q6>arm.limits_map.q6[1]){
     arm.angles_map.q6=arm.limits_map.q6[1]
    }
    getTxt();
 }
 function move_rotation(data, sign=1){
    arm.angles_map.q1+=data*sign
    if (arm.angles_map.q1<arm.limits_map.q1[0]){
    arm.angles_map.q1=arm.limits_map.q1[0]
    }else if (arm.angles_map.q1>arm.limits_map.q1[1]){
    arm.angles_map.q1=arm.limits_map.q1[1]
    }
    getText();
}
function move_yellow(data, sign=1){
    arm.angles_map.q2+=data*sign
    if (arm.angles_map.q2<arm.limits_map.q2[0]){
    arm.angles_map.q2=arm.limits_map.q2[0]
    }else if (arm.angles_map.q2>arm.limits_map.q2[1]){
    arm.angles_map.q2=arm.limits_map.q2[1]
    }
    getText();
}