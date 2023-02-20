var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});

var servo1 = new ROSLIB.Topic({
    ros: ros, 
    name: 'servo_test',
    messageType: "stds_msgs/Int32", queue_size: 1});




