var ros;
var robot_IP;
var bot;
robot_IP = _config.ROSBridge_IP;

ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
    });
var camara_topic= 1;
var simpledrive = new ROSLIB.Topic ({
  ros : ros,
  name : 'SD_WI',
  messageType: 'std_msgs/Bool',
  queue_size: 10
})
function change_camera(camera){
    window.camara_topic = camera;

}
function activate_simpledrive(activation){
  simpledrive.publish(new ROSLIB.Message({data:activation}));
  console.log(activation);
}

    if (_config.is_WebVideo){
        var zed_topic = _config.topic_Zed_Camera;
        var zed_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + zed_topic + "&type=mjpeg";
        document.getElementById("Zed_Camera").src = zed_src; 

        var usb_topic = _config.topic_USB_Camera;
        var usb_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + usb_topic + "&type=ros_compressed ";
        document.getElementById("USB_Camera").src = usb_src; 
    } else {
        var listener = new ROSLIB.Topic({
            ros : ros,
            name : _config.topic_Zed_Camera + '/compressed image',
            messageType : 'sensor_msgs/CompressedImage'
          });
        
        listener.subscribe(function(message) {
          console.log(message.data)
          var imagedata = "data:image/png;base64" + message.data;
          document.getElementById("Zed_Camera").src = imagedata;
          document.getElementById("Zed_Camera").height =message.height;
          document.getElementById("Zed_Camera").width =message.width;     
        });

        var listener2 = new ROSLIB.Topic({
            ros : ros,
            name : _config.topic_USB_Camera + '/compressed',
            messageType : 'sensor_msgs/CompressedImage'
          });
        
        listener2.subscribe(function(message) {
          var imagedata = "data:image/png;base64," + message.data;
          document.getElementById("USB_Camera").src = imagedata;      
        });
    } 
