var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + "localhost" + ":9090"
});
class ArmTeleop{
    constructor(){
        
        this.arm = new ROSLIB.Topic({
            ros: ros,
            name: 'arm_lab',
            messageType : 'servos/arm_lab',
            queue_size:1
        });
        this.servoright = new ROSLIB.Topic({
            ros:ros,
            name:'servo_right',
            messageType: 'std_msgs/Int32',
            queue_size:1
        });
        this.servocenter = new ROSLIB.Topic({
            ros:ros,
            name:'servo_center',
            messageType: 'std_msgs/Int32',
            queue_size:1
        });
        this.servoleft = new ROSLIB.Topic({
            ros:ros,
            name:'servo_left',
            messageType: 'std_msgs/Int32',
            queue_size:1
        });
        this.joint3 = new ROSLIB.Topic({
            ros:ros,
            name:'arm_lab/joint3',
            messageType: 'std_msgs/Int32',
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
            name: 'arm_teleop/joint2_lab',
            messageType: 'std_msgs/Float64',
            queue_size:1
        });
        this.camera = new ROSLIB.Topic({
            ros : ros,
            name : 'arm_teleop/cam',
            messageType : 'std_msgs/Int32',
            queue_size: 1   
        });

        this.limits_map = {
            q1:[-180,0],
            q2:[0,180],
            q3:[0,245], //Cambio de límites
            q4: [0,120],
            q5: [0,50],
            q6:[0,150],
            q7:[-10,10]
        }
        this.angles_map={
            q1:0.0,
            q2:90.0,
            q3:15,
            q4:0,
            q5:0,
            q6:0,
            q7:0
        }  
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
            joint3:my_map(0,245,58,303,this.angles_map.q3),
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
            data:my_map(0,245,58,303,this.angles_map.q3)
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
        this.joint3.publish(message4);
        this.arm.publish(message);
        this.joint1.publish(message2);
        this.joint2.publish(message3);
        this.servoright.publish(message5);
        this.servocenter.publish(message6);
        this.servoleft.publish(message7);

    }
     my_map(in_min, in_max, out_min, out_max, x){ //map arduino
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
        moveServos(servo_id,servo_dir,servo_step){
            switch(servo_id){
                case 1:
                    if(servo_dir=="+"){
                        this.angles_map.q4+=servo_step;
                    }
                    else{
                        this.angles_map.q4-=servo_step;
                    }
                    break;
                case 2: 
                    if(servo_dir=="+"){
                        this.angles_map.q5+=servo_step;
                    }
                    else{
                        this.angles_map.q5-=servo_step;
                    }
                    break;
                case 3:
                        if(servo_dir=="+"){
                            this.angles_map.q6+=servo_step;
                        }
                        else{
                            this.angles_map.q6-=servo_step;
                        }
                    break;
                case 4:
                    if(servo_dir=="+"){
                        this.angles_map.q3+=servo_step;
                        //this.angles_map.q3 = my_map(0,245,58,303,this.angles_map.q3);
                    }
                    else{
                        this.angles_map.q3-=servo_step;
                        //this.angles_map.q3 = my_map(0,245,58,303,this.angles_map.q3);
                    }
                    break;
            }
            getTxt();
        }
        

    }
let arm = new ArmTeleop();

var l2=3.5;
var l3=2.5;


function predefinedPosition(position){
    switch(position){
        case "HOME":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=15;
            break;
        case "INTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=70;
            break
        case "GROUND":
            arm.angles_map.q1=0;
            arm.angles_map.q2=15;
            arm.angles_map.q3=70;
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
            arm.angles_map.q1=-165;
            arm.angles_map.q2=107;
            arm.angles_map.q3=40;
    }
    getTxt();
    
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
            break;
        case 2:
            arm.angles_map.q2=(arm.limits_map.q2,data);
            break;
        case 3:
            arm.angles_map.q3=(arm.limits_map.q3,my_map(-0,245,58,303,data));
            break;
        case 4:
            arm.angles_map.q4=(arm.limits_map.q4,data);
            break;
        case 5:
            arm.angles_map.q5=(arm.limits_map.q5,data);
            break;
        case 6:
            arm.angles_map.q6=(arm.limits_map.q6,data);
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
function moveCentrifuge(data){
    arm.angles_map.q7=data;
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
    var Centrifuge = String(arm.angles_map.q7);

  
    localStorage.setItem("Rotation",Rotation);
    localStorage.setItem("YJ",YellowJacketAxis2);
    localStorage.setItem("Axis3",ServoAxis3);
    localStorage.setItem("LS",Servo_Left);
    localStorage.setItem("CS",Servo_Center);
    localStorage.setItem("RS",Servo_Right);
    localStorage.setItem("Centrifuge",Centrifuge);

    document.getElementById("Rotation").innerHTML = Rotation;
    document.getElementById("YJ").innerHTML = YellowJacketAxis2;
    document.getElementById("Axis3").innerHTML = ServoAxis3;
    document.getElementById("LS").innerHTML = Servo_Left;
    document.getElementById("CS").innerHTML = Servo_Center;
    document.getElementById("RS").innerHTML = Servo_Right;
    document.getElementById("Centrifuge").innerHTML = Centrifuge;
    arm_interface(arm.angles_map.q2,arm.angles_map.q3);
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