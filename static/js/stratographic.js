document.addEventListener("DOMContentLoaded", function() {
  const imageInputs = document.querySelectorAll('.image-input');
  imageInputs.forEach((input, index) => {
      input.addEventListener('change', function(event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = function(e) {
              const imgElement = new Image();
              imgElement.src = e.target.result;

              imgElement.onload = async function() {
                  if (index % 2 == 0) {
                      superponerImagenes(index, imgElement);
                  } else if (index % 2 == 1) {
                      superponerEscala(index, imgElement);
                  } else {
                      console.log("Perfil estatigráfico");
                      const responseMessage = document.getElementById('responseMessage');

                      // Crear FormData con la imagen seleccionada
                      const formData = new FormData();
                      formData.append('image', file);  // Cambiado a 'image'

                      try {
                          const response = await fetch('/upload', {
                              method: 'POST',
                              body: formData,
                          });

                          if (response.ok) {
                              responseMessage.textContent = 'Imagen enviada correctamente.';
                              responseMessage.style.color = 'green';
                          } else {
                              const errorData = await response.json();
                              responseMessage.textContent = `Error: ${errorData.error}`;
                              responseMessage.style.color = 'red';
                          }
                      } catch (error) {
                          console.error('Error al enviar la imagen:', error);
                          responseMessage.textContent = 'Error al enviar la imagen. Por favor, inténtalo de nuevo.';
                          responseMessage.style.color = 'red';
                      }
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
  imagenSuperpuesta.src = "static/img/brujula2.png";
  imagenSuperpuesta.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Guardar el estado del contexto
      ctx.save();

      // Mover el contexto al centro de la imagen de la brújula
      const compassWidth = 100; // Ajusta el ancho de la brújula
      const compassHeight = 100; // Ajusta la altura de la brújula
      ctx.translate(compassWidth / 2, compassHeight / 2);

      let id_angulo = 'angulo' + (index + 1);
      let angulo = document.getElementById(id_angulo).value;

      if (!isNaN(angulo)) {
          // Rotar el contexto 45 grados (en radianes)
          ctx.rotate((angulo - 90) * Math.PI / 180);
      }

      // Dibujar la brújula en el contexto rotado
      ctx.drawImage(imagenSuperpuesta, -compassWidth / 2, -compassHeight / 2, compassWidth, compassHeight);
      var imagen_escala = new Image();
      imagen_escala.src = "static/img/escala.jpeg";
      imagen_escala.onload = function() {
          const escalaWidth = 100; // Ajusta el ancho de la escala
          const escalaHeight = 20; // Ajusta la altura de la escala

          // Calcula las coordenadas de la esquina inferior derecha
          const x = canvas.width - escalaWidth;
          const y = canvas.height - escalaHeight;

          // Dibuja la imagen escalada en la esquina inferior derecha
          ctx.drawImage(imagen_escala, x, y, escalaWidth, escalaHeight);
      };

      // Restaurar el estado del contexto
      ctx.restore();

      ctx.globalAlpha = 1.0; // Restablece la opacidad para futuras operaciones
  };

  // Mostrar el canvas
  canvas.style.display = 'block';
}

function superponerEscala(index, image) {
  let idcanvas = 'i' + (index + 1);
  let canvas = document.getElementById(idcanvas);

  if (!canvas) {
      console.error('Canvas no encontrado: ' + idcanvas);
      return;
  }
  var ctx = canvas.getContext('2d');
  var imagen_escala = new Image();

  imagen_escala.src = "static/img/escala.jpeg";
  imagen_escala.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const escalaWidth = 100; // Ajusta el ancho de la escala
      const escalaHeight = 20; // Ajusta la altura de la escala

      // Calcula las coordenadas de la esquina inferior derecha
      const x = canvas.width - escalaWidth;
      const y = canvas.height - escalaHeight;

      // Dibuja la imagen escalada en la esquina inferior derecha
      ctx.drawImage(imagen_escala, x, y, escalaWidth, escalaHeight);
  };

  // Restaurar el estado del contexto
  ctx.restore();

  ctx.globalAlpha = 1.0; // Restablece la opacidad para futuras operaciones
  canvas.style.display = 'block';
}