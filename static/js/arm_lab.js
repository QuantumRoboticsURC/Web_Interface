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
        this.centrifugadora= new ROSLIB.Topic({
            ros : ros,
            name : 'centrifuge',
            messageType : 'std_msgs/Float64',
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
            name : 'arm_teleop/camA',
            messageType : 'std_msgs/Int32',
            queue_size: 1   
        });

        this.limits_map = {
            q1:[0,180],
            q2:[0,150],
            q3:[285,462], //Cambio de límites
            q4: [0,150],
            q5: [0,173],
            q6:[0,171],
            q7:[-10,10],
            q8:[0,180]
        }
        this.angles_map={
            q1:0.0,
            q2:90.0,
            q3:330,
            q4:150,
            q5:170,
            q6:167,
            q7:0,
            q8:45
            
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
        this.angles_map.q8=qlimit(this.limits_map.q8,this.angles_map.q8)
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
        var message9 = new ROSLIB.Message({
            data:this.angles_map.q8
        })
        this.joint3.publish(message4);
        //this.arm.publish(message);
        this.joint1.publish(message2);
        this.joint2.publish(message3);
        this.servoright.publish(message5);
        this.servocenter.publish(message6);
        this.servoleft.publish(message7);
        this.centrifugadora.publish(message8);
        this.cameraA.publish(message9);
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
                case 5:
                    if(servo_dir=="+"){
                        this.angles_map.q8+=servo_step;
                        //this.angles_map.q3 = my_map(0,245,58,303,this.angles_map.q3);
                    }
                    else{
                        this.angles_map.q8-=servo_step;
                        //this.angles_map.q3 = my_map(0,245,58,303,this.angles_map.q3);
                    }
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
            arm.angles_map.q2=130;
            arm.angles_map.q3=300;
            break;
        case "INTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=65;
            arm.angles_map.q3=358;
            break
        case "GROUND":
            arm.angles_map.q1=0;
            arm.angles_map.q2=-24;
            arm.angles_map.q3=415;
            break
        case "GROUNDINTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=45;
            arm.angles_map.q3=430;
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
            document.getElementById("Left_Txt").value = 5;
            
            break;
        case 2:
            arm.angles_map.q2=(arm.limits_map.q2,data);
            document.getElementById("Left_Txt").value = 5;
            break;
        case 3:
            arm.angles_map.q3=(arm.limits_map.q3,data);
            document.getElementById("Axis3_Txt").value = 5;
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
function moveCentrifuge(data){
    arm.angles_map.q7=data;
    getTxt();
}
function change_led(data){
    arm.led_signal(data);
    //getTxt();
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
    var q3n=my_map(285,462,-177,0,q3);
 
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

coordenates = new ROSLIB.Topic({
    ros:ros,
    name:'ublox/gps_goal',
    messageType: 'sensor_msgs/NavSatFix',
    queue_size:1
})

function publish_coordanates(){
    latitud=document.getElementById('Latitud_Txt').value;
    longitudl=document.getElementById('Longitud_Txt').value;
    console.log(latitud);
    coordenadas=latitud+","+longitudl;
    console.log(coordenadas);
    var message =new ROSLIB.Message({
        latitude: parseFloat(latitud),
        longitude: parseFloat(longitudl)
    })
    coordenates.publish(message);
}
var antenna_on = new ROSLIB.Service({
    ros : ros,
    name : '/camera_antenna/start_capture',
    serviceType : 'std_srvs/Empty'
    });
var antenna_off = new ROSLIB.Service({
    ros : ros,
    name : '/camera_antenna/stop_capture',
    serviceType : 'std_srvs/Empty'
    });
var centrifuge_on = new ROSLIB.Service({
    ros : ros,
    name : '/zedm/zed_node/start_remote_stream',
    serviceType : 'std_srvs/Empty'
    });
var centrifuge_off = new ROSLIB.Service({
    ros : ros,
    name : '/zedm/zed_node/stop_remote_stream',
    serviceType : 'std_srvs/Empty'
    });
var arm_on = new ROSLIB.Service({
    ros : ros,
    name : '/camera_arm/start_capture',
    serviceType : 'std_srvs/Empty'
    });
var arm_off = new ROSLIB.Service({
    ros : ros,
    name : '/camera_arm/stop_capture',
    serviceType : 'std_srvs/Empty'
    });
function Camera_on_off(cam,status){
    switch(cam){
        case(1):
            if (status){
                var request = new ROSLIB.ServiceRequest({});
                antenna_on.callService(request,function(){console.log("on")});
                
            } else{
                var request2 = new ROSLIB.ServiceRequest({});
                antenna_off.callService(request2,function(){console.log("off")});
                
            }
            break;
        case(2):
            if (status){
                var request3 = new ROSLIB.ServiceRequest({});
                centrifuge_on.callService(request3,function(){console.log("on")});    
            } else{
                var request4 = new ROSLIB.ServiceRequest({});
                centrifuge_off.callService(request4,function(){console.log("off")});
            }
            break;
        case(3):
            if (status){
                var request5 = new ROSLIB.ServiceRequest({});
                arm_on.callService(request5,function(){console.log("on")});    
            } else{
                var request6 = new ROSLIB.ServiceRequest({});
                arm_off.callService(request6,function(){console.log("off")});
            }
            break;
    }
}