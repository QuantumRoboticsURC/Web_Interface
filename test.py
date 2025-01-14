from skimage import color
from skimage.filters import threshold_otsu
import matplotlib.pyplot as plt
import cv2

def show_image(image):

    # Convertirla a RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 

    # Convertir la imagen a escala de grises
    gray_image = color.rgb2gray(image)
    
    # Calcular el umbral de Otsu
    thresh = threshold_otsu(gray_image)
    
    # Crear la imagen binaria
    binary_image = gray_image > thresh
    
    #Mostrar la imagen original y la imagen con bordes detectados
    plt.figure(figsize=(20, 5))
    plt.title("\nThresholding")
    plt.axis("off")

    # Subplot 1: Mostrar la imagen original
    plt.subplot(1, 3, 1)
    plt.imshow(image_rgb)
    plt.title('Original')
    plt.axis('off')  # Ocultar los ejes

    # Subplot 2: Mostrar la imagen en escala de grises
    plt.subplot(1, 3, 2)
    plt.imshow(gray_image, cmap = "gray")
    plt.title(f"Otsu Threshold: {thresh:.2f}")
    plt.axis('off')  # Ocultar los ejes

    # Subplot 2: Mostrar la imagen binaria
    plt.subplot(1, 3, 3)
    plt.imshow(binary_image, cmap='gray')
    plt.title('Binary Image')
    plt.axis('off')
    
    # Ajustar y mostrar ambas imágenes
    plt.tight_layout()
    plt.show()

if __name__ == "main":
    show_image()

