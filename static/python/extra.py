import cv2
import numpy as np

# Función para normalizar imágenes y guardarlas
def normalize_and_save_image(image, path):
    # Si la imagen tiene valores flotantes entre 0 y 1, multiplícalos por 255 y convierte a uint8
    if image.dtype != np.uint8:
        image = np.clip(image * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(path, image)

def convert_to_8bit(image):
    # Si la imagen es de tipo bool (imagen binaria), la convertimos a uint8
    if image.dtype == 'bool':
        image = np.uint8(image * 255)  # Convertir a 0 o 255
    elif image.dtype != 'uint8':  # Si no es uint8, convertimos
        image = cv2.convertScaleAbs(image)
    return image