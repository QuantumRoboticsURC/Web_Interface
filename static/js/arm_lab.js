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
            q3:[155,90],
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
    moveServo(servo_id,servo_dir){
        switch(servo_id){
            case 1:
                if(this.angles_map.q4>=this.limits_map.q4[0] && this.angles_map.q4<=this.limits_map.q4[1]){
                    if(servo_dir=="+"){
                        this.angles_map.q4= this.angles_map.q4+5;
                    }
                    else{
                        this.angles_map.q4-= this.angles_map.q4-5;
                    }
                    
                }
                break;
            case 2: 
                if(this.angles_map.q5>=this.limits_map.q5[0] && this.angles_map.q5<=this.limits_map.q5[1]){
                    if(servo_dir=="+"){
                        this.angles_map.q5=this.angles_map.q5+5;
                    }
                    else{
                        this.angles_map.q5= this.angles_map.q5-5;
                    }
                }
                break;
            case 3:
                if(this.angles_map.q6>=this.limits_map.q6[0] && this.angles_map.q6<=this.limits_map.q6[1]){
                    if(servo_dir=="+"){
                        this.angles_map.q6= this.angles_map.q6+5;
                    }
                    else{
                        this.angles_map.q6= this.angles_map.q6-5;;
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
function moveServos(servo_id,servo_dir){
    arm.moveServo(servo_id,servo_dir);
    arm.publishMessages();
}