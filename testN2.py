import cv2
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

# Función para aplicar K-Means y devolver la imagen segmentada
def apply_kmeans(pixels, n_clusters):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=5, max_iter=100)
    labels = kmeans.fit_predict(pixels)
    centers = kmeans.cluster_centers_
    return labels, centers

# Reconstruir las imágenes segmentadas para cada espacio de color
def reconstruct_image(labels, centers, shape):
    # Crear una nueva imagen segmentada a partir de las etiquetas y centros
    segmented_image = centers[labels].reshape(-1, 3)  # Se hace reshape en 1D para que coincidan las dimensiones
    segmented_image = np.clip(segmented_image, 0, 255).astype(np.uint8)
    return segmented_image.reshape(shape)  # Finalmente, se resuelve la imagen en la forma original
