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
  
  // Llamar a initColorPicker tres veces con diferentes ids
  //Biuret
  const biuret = ["rgb(146, 98, 137)", "rgb(199, 131, 149)", "rgb(219, 195, 253)"]
  initColorPicker('picker1', biuret);
  //Lugol
  const lugol = ["rgb(38, 36, 77)", "rgb(217, 80, 88)"]
  initColorPicker('picker2', lugol);
  //Benedict
  const benedict = ["rgb(70, 86, 127)", "rgb(85, 103, 130)", "rgb(35, 118, 196)", "rgb(25, 104, 168)", "rgb(36, 166, 226)"]
  initColorPicker('picker3', benedict);
}

//   // Asigna el evento a todos los input files con clase "image-input"
//   const imageInputs = document.querySelectorAll('.image-input');
//   imageInputs.forEach(input => {
//       input.addEventListener('change', handleImage);
//   });
// };

function initColorPicker(pickerId, colores) {
  // Obtener todos los elementos con la clase 'cuadro'
  // const cuadros = document.querySelectorAll('.cuadro');

  // Iterar sobre cada cuadro y obtener su color
  // cuadros.forEach(cuadro => {
  //     // Obtener el color del cuadro
  //     const color = window.getComputedStyle(cuadro).backgroundColor;
  //     colores.push(color);
  //     console.log(colores)
  // });

  // Configurar opciones del color picker
  const colorPickerOptions = {
      colors: colores,
      width: 500,
      slider: false,
      sliderSize: 0,
  };

  // Crear el color picker con las opciones configuradas
  var colorPicker = new iro.ColorPicker('#' + pickerId, colorPickerOptions);
}

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

// function handleImage(event) {
//   const imageInput = event.target;
//   const cardHeader = imageInput.closest('.card-header');
//   const canvas = cardHeader.querySelector('.canvas');
//   const resultElement = cardHeader.querySelector('.result');
//   const selectedImageContainer = cardHeader.querySelector('.selected-image-container');
//   const colorSquare = cardHeader.querySelector('.color-square');
//   const colorIndicator = cardHeader.querySelector('.color-indicator');
//   const colorPickerContainer = cardHeader.querySelector('.color-picker');

//   // Elimina el color-picker existente
//   colorPickerContainer.innerHTML = '';

//   const file = imageInput.files[0];
//   const reader = new FileReader();

//   reader.onload = function (e) {
//       const img = new Image();
//       img.src = e.target.result;

//       img.onload = function () {
//           const context = canvas.getContext('2d');
//           context.drawImage(img, 0, 0, canvas.width, canvas.height);

//           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//           const pixels = imageData.data;

//           let totalRed = 0;
//           let totalGreen = 0;
//           let totalBlue = 0;

//           for (let i = 0; i < pixels.length; i += 4) {
//               totalRed += pixels[i];
//               totalGreen += pixels[i + 1];
//               totalBlue += pixels[i + 2];
//           }

//           const totalPixels = pixels.length / 4;
//           const averageRed = Math.round(totalRed / totalPixels);
//           const averageGreen = Math.round(totalGreen / totalPixels);
//           const averageBlue = Math.round(totalBlue / totalPixels);

//           // Crea un nuevo color-picker
//           const colorPicker = new iro.ColorPicker(colorPickerContainer, {
//               color: "#fff", interactive: false, width: 400
//           });

//           const averageHexColor = rgbToHex(averageRed, averageGreen, averageBlue);
//           colorPicker.color.set(averageHexColor);

//           //Checar el colocar mas picker(circulos) para ver mas colores
//           colorIndicator.style.backgroundColor = averageHexColor;

//           resultElement.innerHTML = `Color Promedio: rgb(${averageRed}, ${averageGreen}, ${averageBlue})  HEX: ${averageHexColor}`;
//           colorSquare.style.background = `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;

//           const imgElement = document.createElement('img');
//           imgElement.src = e.target.result;
//           imgElement.alt = 'Selected Image';
//           imgElement.style.width = '200px';
//           selectedImageContainer.innerHTML = '';
//           selectedImageContainer.appendChild(imgElement);
//           console.log(parseInt(averageHexColor.slice(1), 16));
//       };
//   };


//   reader.readAsDataURL(file);
// }

// function showImage() {
//   const input = document.getElementById('inputImage');
//   const container = document.getElementById('imageContainer');

//   // Verificar si se ha seleccionado un archivo
//   if (input.files && input.files[0]) {
//       const reader = new FileReader();

//       // Definir la función de callback cuando la imagen se carga
//       reader.onload = function (e) {
//           // Crear un elemento de imagen
//           const imgElement = document.createElement('img');
//           imgElement.src = e.target.result;
          
//           // Limpiar el contenedor de la imagen antes de mostrar la nueva imagen
//           container.innerHTML = '';

//           // Agregar la imagen al contenedor
//           container.appendChild(imgElement);
//       }

//       // Leer el contenido del archivo como una URL de datos
//       reader.readAsDataURL(input.files[0]);
//   } else {
//       // Si no se seleccionó ninguna imagen, mostrar un mensaje de error
//       container.innerHTML = 'Por favor, selecciona una imagen.';
//   }
// }
document.addEventListener("DOMContentLoaded", function() {
  const imageInputs = document.querySelectorAll('.image-input');
  const selectedImageContainers = document.querySelectorAll('.selected-image-container');

  imageInputs.forEach((input, index) => {
    input.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function(e) {
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.alt = 'Selected Image';
        imgElement.style.width = '450px'; // Corregir el valor de estilo width (Opx a 450px)
        selectedImageContainers[index].innerHTML = ''; // Usar index para seleccionar el contenedor adecuado
        selectedImageContainers[index].appendChild(imgElement); // Usar index para seleccionar el contenedor adecuado
        
        imgElement.onload = function() {
          recortarImagen(imgElement, index);
        };
      };

      reader.readAsDataURL(file);
    });
  });

  function recortarImagen(data, index) {
    console.log(index)
    const Ancho = data.naturalWidth;
    const Altura = data.naturalHeight;
    const nuevoAncho = Ancho/4;
    const nuevaAltura = Altura;
    for (let i = 0; i < 4; i++){
      let id_canvas = "e"+ (index+1) +"_" + (i + 1);
      let canvas = document.getElementById(id_canvas);

      if (canvas && canvas.getContext) {
        let ctx = canvas.getContext('2d');
        var inicioX = i * nuevoAncho;

        // Ajustar el tamaño del canvas
        canvas.width = nuevoAncho;
        canvas.height = nuevaAltura;

        // Mostrar el canvas
        canvas.style.display = 'block';

        // Dibujar la imagen recortada en el canvas
        ctx.drawImage(data, inicioX, 0, nuevoAncho, nuevaAltura, 0, 0, nuevoAncho, nuevaAltura);
        console.log(`Dibujando en canvas ${id_canvas} desde x=${inicioX}`);

        const imageData = ctx.getImageData(0, 0, nuevoAncho, nuevaAltura);
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
        let id_color_picker= "cpe" + (index + 1) + "_" + (i +1);
        let colorPickerContainer = document.getElementById(id_color_picker);
        // Elimina el color-picker existente
        colorPickerContainer.innerHTML = '';
        // Crea un nuevo color-picker
        const colorPicker = new iro.ColorPicker(colorPickerContainer, {
            color: "#fff", interactive: false, width: 400
        });

        const averageHexColor = rgbToHex(averageRed, averageGreen, averageBlue);
        colorPicker.color.set(averageHexColor);
        let id_color_indicator = "cie" + (index + 1) + "_" + (i +1);
        let colorIndicator = document.getElementById(id_color_indicator);
        //Checar el colocar mas picker(circulos) para ver mas colores
        colorIndicator.style.backgroundColor = averageHexColor;
        let id_texto = "te" + (index + 1) + "_" + (i +1);
        resultElement = document.getElementById(id_texto)
        resultElement.innerHTML = `Color Promedio: rgb(${averageRed}, ${averageGreen}, ${averageBlue})  HEX: ${averageHexColor}`;
        let id_cuadro = "ce" + (index + 1) + "_" + (i +1);
        colorSquare = document.getElementById(id_cuadro);
        colorSquare.style.background = `rgb(${averageRed}, ${averageGreen}, ${averageBlue})`;



        console.log(imageData);
      } else {
        console.error(`El elemento con id ${id_canvas} no es un canvas o no existe.`);
      }
    }
    
}
});