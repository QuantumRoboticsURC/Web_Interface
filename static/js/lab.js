var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});

var getPhoto= new ROSLIB.Service({
  ros:ros,
  name:
});


window.onload = function() {
    update();
  };




function update() {
$.get("get_img", function(data, status){
    var container = document.getElementById("imgsContainerBucket");
    for (const element of data.lab_imgs) {
        var hh = '<div class="column">'+
                    '<img src="static/img/lab/'+element+'" alt="'+element.split(".")[0]+'" onclick="expand(this);">'+
                '</div>'
        container.innerHTML += hh;
      }       
  });
}

function expand(imgs) {
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
    expandImg.parentElement.style.display = "block";
} 