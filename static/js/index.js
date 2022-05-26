var ros;
var robot_IP;

window.onload = function () {
    robot_IP = _config.ROSBridge_IP;

    ros = new ROSLIB.Ros({
        url: "ws://" + robot_IP + ":9090"
    });

    if (_config.is_WebVideo){
        var zed_topic = _config.topic_Zed_Camera;
        var zed_src = "http://" + _config.WEB_Video_Server + "/stream?topic=" + zed_topic + "&type=ros_compressed";
        document.getElementById("Zed_Camera").src = zed_src; 

        var usb_topic = _config.topic_USB_Camera;
        var usb_src = "http://" + _config.WEB_Video_Server + "/stream?topic=" + usb_topic + "&type=ros_compressed";
        document.getElementById("USB_Camera").src = usb_src; 
    } else {
        var listener = new ROSLIB.Topic({
            ros : ros,
            name : _config.topic_Zed_Camera + '/compressed',
            messageType : 'sensor_msgs/CompressedImage'
          });
        
        listener.subscribe(function(message) {
          var imagedata = "data:image/png;base64," + message.data;
          document.getElementById("Zed_Camera").src = imagedata;      
        });

        var listener = new ROSLIB.Topic({
            ros : ros,
            name : _config.topic_USB_Camera + '/compressed',
            messageType : 'sensor_msgs/CompressedImage'
          });
        
        listener.subscribe(function(message) {
          var imagedata = "data:image/png;base64," + message.data;
          document.getElementById("USB_Camera").src = imagedata;      
        });
    } 
}