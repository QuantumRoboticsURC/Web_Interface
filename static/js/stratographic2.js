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
          selectedImageContainers[index].innerHTML = ''; // Usar index para seleccionar el contenedor adecuado
          selectedImageContainers[index].appendChild(imgElement); // Usar index para seleccionar el contenedor adecuado

          imgElement.onload = function() {
            if(index%3 ==0){
                BrujulayEscala(imgElement, index);
            }
          };
        };
  
        reader.readAsDataURL(file);
      });
    });
  });

function BrujulayEscala(image, index){
    console.log("Estoy colocando la brujula en " + index)
    var brujula = new Image();
    brujula.src = "static/img/Brujula.jpeg";
    const Ancho = brujula.naturalWidth;
    const Altura = brujula.naturalHeight;
    console.log(Ancho + ", " + Altura);
    //const imageData = ctx.getImageData(0, 0, nuevoAncho, nuevaAltura);
    //const pixels = imageData.data;
}