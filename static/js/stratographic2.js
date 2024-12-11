document.addEventListener("DOMContentLoaded", function() {
  const imageInputs = document.querySelectorAll('.image-input');
  imageInputs.forEach((input, index) => {
      input.addEventListener('change', function(event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = function(e) {
              const imgElement = new Image();
              imgElement.src = e.target.result;

              imgElement.onload = function() {
                if (index % 3 == 0) {
                  superponerImagenes(index, imgElement);
                }
              };
          };
          reader.readAsDataURL(file);
      });
  });
});

function superponerImagenes(index, image) {
  let idcanvas = 'i' + (index + 1);
  let canvas = document.getElementById(idcanvas);
  console.log('El id del canvas es: ' + idcanvas);
  console.log(canvas);
  if (!canvas) {
      console.error('Canvas no encontrado: ' + idcanvas);
      return;
  }
  var ctx = canvas.getContext('2d');
  var imagenSuperpuesta = new Image();
  imagenSuperpuesta.src = "static/img/Brujula.jpeg";
  imagenSuperpuesta.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5; // Ajusta la opacidad de la segunda imagen
      // Dibuja la brújula en la esquina superior izquierda
      const compassWidth = 100; // Ajusta el ancho de la brújula
      const compassHeight = 100; // Ajusta la altura de la brújula
      ctx.drawImage(imagenSuperpuesta, 0, 0, compassWidth, compassHeight);
      ctx.globalAlpha = 1.0; // Restablece la opacidad para futuras operaciones
  };
}