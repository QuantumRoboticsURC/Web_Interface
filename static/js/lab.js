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

function handleimage(imgs) {
  
    document.getElementById('imageInput').addEventListener('change', handleImage);
    var expandImg = document.getElementById("expandedImg");
    var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    imgText.innerHTML = imgs.alt;
    expandImg.parentElement.style.display = "block";

    function handleImage(event) {
      const imageInput = event.target;
      const canvas = document.getElementById('canvas');
      const resultElement = document.getElementById('result');
      const colorBar = document.getElementById('colorBar');
      const context = canvas.getContext('2d');

      const file = imageInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
          context.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Obtener los datos de píxeles
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          // Calcular el color promedio
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

         // Para mostrar el resultado
         resultElement.innerHTML = `Color Promedio: rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;

         // Actualizar el cuadro del color promedio
         colorSquare.style.background = `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;

         // Para actualizar la barra de colores
         colorBar.style.background = `linear-gradient(to bottom, white, rgb(${averageRed}, ${averageGreen}, ${averageBlue}), black)`;

         // Mostrar la imagen seleccionada al lado
         selectedImageContainer.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
        };
      };

      reader.readAsDataURL(file); } }
