var ros;
var robot_IP;

//IP of computer running ROS_BRIDGE, (planned to be 192.168.1.6)
robot_IP = _config.ROSBridge_IP;
ros = new ROSLIB.Ros({
    url: "ws://" + robot_IP + ":9090"
});




/*
var listener = new ROSLIB.Topic({
  ros:ros,
  name : "/usb_cam/image_raw/compressed",
  messgaeType: "sensor_msgs/CompressedImage"
});


listener.subscribe(function(message){
  var imagedata = "data:image/png;base64,"+message.data;
  document.getElementById("biuret1").src=imagedata;
  console.log("Prueba")
});
*/

var service = new ROSLIB.Service({
  ros:ros,
  name : "/camera_info",
  servicType:"/camera_manager/camera_photo"

});
request = new ROSLIB.ServiceRequest({
  choice:0

});

function takePicture(parameter){
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  service.callService(request,function(result){
    var imagedata = "data:image/png;base64,"+result.cam.data;
    document.getElementById(parameter).src=imagedata;
  });
};

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

//Lab

function rgbToHex(red, green, blue) {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hexRed = toHex(red);
  const hexGreen = toHex(green);
  const hexBlue = toHex(blue);

  return `#${hexRed}${hexGreen}${hexBlue}`;
}

window.onload = function() {
  // Asigna el evento a todos los input files con clase "image-input"
  const imageInputs = document.querySelectorAll('.image-input');
  imageInputs.forEach(input => {
      input.addEventListener('change', handleImage);
  });
};

function handleImage(event) {
  const imageInput = event.target;
  const cardHeader = imageInput.closest('.card-header');
  const canvas = cardHeader.querySelector('.canvas');
  const resultElement = cardHeader.querySelector('.result');
  const selectedImageContainer = cardHeader.querySelector('.selected-image-container');
  const colorSquare = cardHeader.querySelector('.color-square');
  const colorIndicator = cardHeader.querySelector('.color-indicator');
  const colorPickerContainer = cardHeader.querySelector('.color-picker');

  // Elimina el color-picker existente
  colorPickerContainer.innerHTML = '';

  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function () {
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          let totalRed = 0;
          let totalGreen = 0;
          let totalBlue = 0;

          for (let i = 0; i < pixels.length; i += 4) {
              totalRed += pixels[i];
              totalGreen += pixels[i + 1];
              totalBlue += pixels[i + 2];
          }

          const totalPixels = pixels.length / 4;
          const averageRed = Math.round(totalRed / totalPixels);
          const averageGreen = Math.round(totalGreen / totalPixels);
          const averageBlue = Math.round(totalBlue / totalPixels);

          // Crea un nuevo color-picker
          const colorPicker = new iro.ColorPicker(colorPickerContainer, {
              width: 180, color: "#fff", interactive: false
          });

          const averageHexColor = rgbToHex(averageRed, averageGreen, averageBlue);
          colorPicker.color.set(averageHexColor);
          colorIndicator.style.backgroundColor = averageHexColor;

          resultElement.innerHTML = `Color Promedio: rgb(${averageRed}, ${averageGreen}, ${averageBlue})  HEX: ${averageHexColor}`;
          colorSquare.style.background = `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;

          const imgElement = document.createElement('img');
          imgElement.src = e.target.result;
          imgElement.alt = 'Selected Image';
          imgElement.style.width = '200px';
          selectedImageContainer.innerHTML = '';
          selectedImageContainer.appendChild(imgElement);
      };
  };

  reader.readAsDataURL(file);
}
