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
        this.servo1 = new ROSLIB.Topic({
            ros:ros,
            name:'/science/servos1',
            messageType: 'std_msgs/Int8',
            queue_size:1
        });
        this.servo2 = new ROSLIB.Topic({
            ros:ros,
            name:'/science/servos2',
            messageType: 'std_msgs/Int8',
            queue_size:1
        });
    
        this.servo3 = new ROSLIB.Topic({
            ros:ros,
            name:'/science/servo3',
            messageType: 'std_msgs/Float64',
            queue_size:1
        });
        this.servo4= new ROSLIB.Topic({
            ros: ros,
            
            name: '/science/servo4',
            messageType: 'std_msgs/Float64',
            queue_size:1
        })
        this.camera = new ROSLIB.Topic({
            ros : ros,
            name : 'arm_teleop/cam',
            messageType : 'std_msgs/Int8',
            queue_size: 1 //  
        });
        this.joint2= new ROSLIB.Topic({
            ros: ros,
            name: 'arm_teleop/joint2_unprocessed',
            messageType: 'std_msgs/Float64',
            queue_size:1
        });
        this.servoleft= new ROSLIB.Topic({
            ros : ros,
            name : 'science/servosaa',
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
       
        this.angles_map={
            q1:0.0,
            q2:0.0,
            q3:0.0,
            q4:0.0,
            q5:0.0,
            
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
        
        var message1 =new ROSLIB.Message({
            data:this.angles_map.q1
        })
        var message2=new ROSLIB.Message({
            data:this.angles_map.q2
        })
        var message3 = new ROSLIB.Message({
            data:this.angles_map.q3
        });
        var message4 = new ROSLIB.Message({
            data:this.angles_map.q4
        });
        var message5 = new ROSLIB.Message({
            data:this.angles_map.q5
        });
        this.servo1.publish(message1);
        this.servo2.publish(message2);
        this.servo3.publish(message3);
        this.servo4.publish(message4);
        this.camera.publish(message5);
        //this.servoleft.publish(message8);
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
    servo_posicion(num_garra, pos) {
        console.log(pos);
        switch (num_garra) {
            case 1:
                this.angles_map.q1 = pos;
                break;
            case 2:
                this.angles_map.q2 = pos;
                break;
            case 3:
                this.angles_map.q3 = pos;
                break;
            case 4:
                this.angles_map.q4 = pos;
                break;
            default:
                console.log("Valor no reconocido: " + num_garra);
                break;
        }
        getTxt();
    }
    Up_Down (valor){

        var message = new ROSLIB.Message({data: valor});
        this.labmechanism.publish(message);
        console.log(valor);
    
    }
    move_cam(data, q){
        console.log(data);
        console.log(q);
    }
}
let arm = new ArmTeleop();


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
    
function getTxt() {
    arm.publishMessages();
}

function rad2deg(radians){return radians * (180/math.pi);}
function deg2rad(degrees){return degrees * (math.pi/180);}
function my_map(in_min, in_max, out_min, out_max, x){ //map arduino
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
