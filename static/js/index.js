// window.addEventListener('DOMContentLoaded', (event)=>{

  let ros;
  let robot_IP;

  const button = document.querySelector('input');
  const disp_usb_topic = document.getElementById("disp-usb-topic");
  const disp_zed_topic = document.getElementById("disp-zed-topic");
  const disp_arm_topic = document.getElementById("disp-arm-topic");

  button.addEventListener('click', setTopics);

  function setTopics() {
    console.log("Botón apretado");

    const topic_selectors = document.querySelectorAll("select")


    let zed_index = topic_selectors[0].options.selectedIndex; 
    let zed_topic = document.querySelector("select").options[zed_index].value;

    let usb_index = topic_selectors[1].options.selectedIndex; 
    let usb_topic = document.querySelector("select").options[usb_index].value;

    let arm_index = topic_selectors[2].options.selectedIndex; 
    let arm_topic = document.querySelector("select").options[arm_index].value;
  
    disp_zed_topic.innerHTML = zed_topic;
    disp_usb_topic.innerHTML = usb_topic;
    disp_arm_topic.innerHTML = arm_topic

    robot_IP = _config.ROSBridge_IP;

    ros = new ROSLIB.Ros({
      url: "ws://" + robot_IP + ":9090"
    });

    if (_config.is_WebVideo){
      console.log("Web video server in use...")
      // var zed_topic = document.querySelector("select").options[zed_index].value;
      var zed_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + zed_topic;
      document.getElementById("Zed_Camera").src = zed_src; 
      console.log(zed_src)

      //var usb_topic = _config.topic_USB_Camera;
      var usb_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + usb_topic;
      document.getElementById("USB_Camera").src = usb_src; 
      console.log(usb_src)

      //var arm_topic = _config.topic_Arm_Camera;
      var arm_src = "http://" + _config.WEB_Video_Server + ":8080/stream?topic=" + arm_topic;
      document.getElementById("Arm_Camera").src = arm_src; 
      console.log(arm_src)

    } else {
      console.log("ROSBridge in use...")
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
  

// })