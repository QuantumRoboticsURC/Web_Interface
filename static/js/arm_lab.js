var ros;
var robot_IP;
var ros = new ROSLIB.Ros({
    url : 'wss://echo.websocket.org'
  });

class ArmTeleop{
    constructor(){
        
        this.arm = new ROSLIB.Topic({
            ros: ros,
            name: "arm_lab",
            messageType : "lab_arm/arm_lab",
            queue_size:1
        });

        this.limits_map = {
            "q1":(-180,0),
            "q2":(-8,164),
            "q3":(-155,90),
            "q4": (0,120),
            "q5": (0,80),
            "q6":(0,110),
            "q7":(-10,10)
        }
        this.angles_map={
            "q1":0.0,
            "q2":90.0,
            "q3":-155,
            "q4":0,
            "q5":0,
            "q6":0,
            "q7":0
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
            centriguga:this.angles_map.q7,
            screenshot:"a"

        });
        this.arm.publish(message);
        console.log(message)
        
    }
    moveServo1(){
        this.angles_map.q4 = this.angles_map.q4+5;

    }
}
let arm = new ArmTeleop();
function test(){
    
    console.log("AAAAAAAAAAAAAAA");
    arm.publishMessages();
}
function moveServo(){
    arm.moveServo1();
    test()


}