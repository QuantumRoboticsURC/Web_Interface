from skimage import color
from skimage.filters import threshold_otsu
import cv2

def otsu_threshold(image):

    # Convertirla a RGB
    original = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 

    # Convertir la imagen a escala de grises
    gray = color.rgb2gray(image)
    
    # Calcular el umbral de Otsu
    thresh = threshold_otsu(gray)
    
    # Crear la imagen binaria
    binary = gray > thresh

    return original, gray, binary

