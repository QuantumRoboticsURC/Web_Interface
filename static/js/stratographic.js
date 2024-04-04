function handleImage(event) {
    const imageInput = event.target;
    const cardHeader = imageInput.closest('.card-header');
    const canvas = cardHeader.querySelector('.canvas');
    const resultElement = cardHeader.querySelector('.result');
    const selectedImageContainer = cardHeader.querySelector('.selected-image-container');
    
  
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

            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.alt = 'Selected Image';
            imgElement.style.width = '200px';
            selectedImageContainer.innerHTML = '';
            selectedImageContainer.appendChild(imgElement);

        }
    }
    reader.readAsDataURL(file);
  } 

  