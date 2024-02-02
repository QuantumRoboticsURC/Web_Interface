_config = {
    ROSBridge_IP : "localhost", //ROSBridge server IP
    WEB_Video_Server : "localhost", //WEB Video Server IP
    is_WebVideo : true, //true if web video server will be used, false if ROSBridge will be used

    topic_Arm_Camera : "/image", //topic of the cam seen in arm dashboard
    topic_Zed_Camera : "/image", //topic of the cam 1 seen in nav dashboard
    topic_USB_Camera : "/usb_cam_1/image_raw" //topic of the cam 2 seen in nav dashboard
}