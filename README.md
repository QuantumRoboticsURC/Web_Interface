<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="qrteam.space">
    <img src="static/img/QLogo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Quantum Robotics Interface</h3>

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Installed and configured ROS in linux. [http://wiki.ros.org/Installation/Ubuntu](http://wiki.ros.org/Installation/Ubuntu)

* Test that everything is working:
   ```sh
   $ roscore
   ```

### Installation

1. Intall ROSBridge: [http://wiki.ros.org/rosbridge_suite](http://wiki.ros.org/rosbridge_suite)
   ```sh
   $ sudo apt install ros-{ROS-VERSION}-rosbridge-suite -y
   ```
2. Intall ROS Web Video Server: [http://wiki.ros.org/web_video_server](http://wiki.ros.org/web_video_server)
   ```sh
   $ sudo apt-get install ros-{ROS-VERSION}-web-video-server
   ```
3. Clone the repo
   ```sh
   $ git clone https://github.com/QuantumRoboticsURC/Web_Interface.git 
   ```
4. Install all interface's requirements:
   ```sh
   $ pip3 install -r requirements.txt
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

1. Start the servers:
   ```sh
    $ rosrun web_video_server web_video_server
    $ roslaunch rosbridge_server rosbridge_websocket.launch
    $ python3 application.py
   ```
2. Adapt the variables in `static/js/config.js`
   ```js
    _config = {
        ROSBridge_IP : "localhost", //ROSBridge server IP
        WEB_Video_Server : "localhost", //WEB Video Server IP
        is_WebVideo : true, //true if web video server will be used, false if ROSBridge will be used

        topic_Arm_Camera : "/zedArm/zed_arm/left_raw/image_raw_color", //topic of the cam seen in arm dashboard
        topic_Zed_Camera : "/zedNav/zed_nav/rgb_raw/image_raw_color", //topic of the cam 1 seen in nav dashboard
        topic_USB_Camera : "/usb_cam_1/image_raw" //topic of the cam 2 seen in nav dashboard
    }
   ```


<p align="right">(<a href="#top">back to top</a>)</p>
