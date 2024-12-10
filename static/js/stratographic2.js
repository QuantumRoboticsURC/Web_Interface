document.addEventListener("DOMContentLoaded", function() {
    const imageInputs = document.querySelectorAll('.image-input');
    const selectedImageContainers = document.querySelectorAll('.selected-image-container');
  
    imageInputs.forEach((input, index) => {
      input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        console.log(index%3);
        reader.onload = function(e) {
          const imgElement = document.createElement('img');
          imgElement.src = e.target.result;
          imgElement.alt = 'Selected Image';
          imgElement.style.width = '450px'; // Corregir el valor de estilo width (Opx a 450px)
          // selectedImageContainers[index].innerHTML = ''; // Usar index para seleccionar el contenedor adecuado
          // selectedImageContainers[index].appendChild(imgElement); // Usar index para seleccionar el contenedor adecuado

          imgElement.onload = function() {
            if(index%3 ==0){
                // BrujulayEscala(imgElement, index);
                superponerImagenes(index, imgElement)
            }
          };
        };
  
        reader.readAsDataURL(file);
      });
    });
  });

  function BrujulayEscala(image, index) {
    console.log("Estoy colocando la brujula en " + index);
    var brujula = new Image();
    brujula.src = "static/img/Brujula.jpeg";
    
    brujula.onload = function() {
        const Ancho = brujula.naturalWidth;
        const Altura = brujula.naturalHeight;
        console.log(Ancho + ", " + Altura);
        //const imageData = ctx.getImageData(0, 0, nuevoAncho, nuevaAltura);
        //const pixels = imageData.data;
    };

    let resultado = image;
    const ancho = image.naturalWidth;
    const largo = image.naturalHeight;

    if (ancho > Ancho && largo > Altura){
      
    }
}

function superponerImagenes(index, image) { 
  let idcanvas = 'i' + (index+1);
  let canvas = document.getElementById('i1');
  console.log('El id del canvas es: '+ idcanvas);
  console.log(canvas);
  var ctx = canvas.getContext('2d'); 
 // var imagenFondo = new Image(); 
  var imagenSuperpuesta = new Image(); 
  //imagenFondo.src = 'ruta/a/tu/imagen1.jpg'; 
  imagenSuperpuesta.src = "static/img/Brujula.jpeg"; 
  image.onload = function() { 
    ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height); 
    imagenSuperpuesta.onload = function() { 
      ctx.drawImage(imagenSuperpuesta, 0, 0, canvas.width, canvas.height); 
    }; 
  };
}


