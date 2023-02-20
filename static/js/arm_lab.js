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
            }
    
        }

    }
let arm = new ArmTeleop();
function test(){   
    console.log("AAAAAAAAAAAAAAA");
    arm.publishMessages();
}
function moveServos(servo_id,servo_dir,servo_step){
    arm.moveServo(servo_id,servo_dir,servo_step);
    arm.publishMessages();
}

function predefinedPosition(position){
    switch(position){
        case "HOME":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=-155;
            break;
        case "INTERMEDIATE":
            arm.angles_map.q1=0;
            arm.angles_map.q2=90;
            arm.angles_map.q3=-90;
            break
        case "GROUND":
            arm.angles_map.q1=0;
            arm.angles_map.q2=-8;
            arm.angles_map.q3=-61;
            break
        case "HORIZONTAL":
            arm.angles_map.q1=0;
            arm.angles_map.q2=0;
            arm.angles_map.q3=0;
            break
        case "LEFT":
            arm.angles_map.q1=-123;
            arm.angles_map.q2=139;
            arm.angles_map.q3=-146;
            break
        case "CENTER":
            arm.angles_map.q1=-95;
            arm.angles_map.q2=155;
            arm.angles_map.q3=-151;
            break
        case "RIGHT":
            arm.angles_map.q1=-149;
            arm.angles_map.q2=139;
            arm.angles_map.q3=-141;  
    }
    arm.publishMessages();
    
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
    localStorage.setItem("YellowJacketAxis2",YellowJacketAxis2);
    localStorage.setItem("ServoAxis3",ServoAxis3);
    localStorage.setItem("Servo_Left",Servo_Left);
    localStorage.setItem("Servo_Center",Servo_Center);
    localStorage.setItem("Servo_Right",Servo_Right);

    document.getElementById("Rotation").innerHTML = Rotation;
    document.getElementById("YJ").innerHTML = YellowJacketAxis2;
    document.getElementById("Axis3").innerHTML = ServoAxis3;
    document.getElementById("SL").innerHTML = Servo_Left;
    document.getElementById("SC").innerHTML = Servo_Center;
    document.getElementById("SR").innerHTML = Servo_Right;
  
}
function go_axis3_servo(data){
    arm.angles_map.q3=data
    if (arm.angles_map.q3<arm.limits_map.q3[0]){
     arm.angles_map.q3=arm.limits_map.q3[0]
    }else if (arm.angles_map.q3>arm.limits_map.q3[1]){
     arm.angles_map.q3=arm.limits_map.q3[1]
    }
    arm.publishMessages();
 }

function go_left_servo(data){
   arm.angles_map.q4=data
   if (arm.angles_map.q4<arm.limits_map.q4[0]){
    arm.angles_map.q4=arm.limits_map.q4[0]
   }else if (arm.angles_map.q4>arm.limits_map.q4[1]){
    arm.angles_map.q4=arm.limits_map.q4[1]
   }
   arm.publishMessages();
}

function go_center_servo(data){
    arm.angles_map.q5=data
    if (arm.angles_map.q5<arm.limits_map.q5[0]){
     arm.angles_map.q5=arm.limits_map.q5[0]
    }else if (arm.angles_map.q5>arm.limits_map.q5[1]){
     arm.angles_map.q5=arm.limits_map.q5[1]
    }
    arm.publishMessages();
 }

 function go_right_servo(data){
    arm.angles_map.q6=data
    if (arm.angles_map.q6<arm.limits_map.q6[0]){
     arm.angles_map.q6=arm.limits_map.q6[0]
    }else if (arm.angles_map.q6>arm.limits_map.q6[1]){
     arm.angles_map.q6=arm.limits_map.q6[1]
    }
    arm.publishMessages();
 }