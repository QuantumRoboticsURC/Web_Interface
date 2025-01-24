import cv2
import matplotlib.pyplot as plt
import time

from static.python.test import otsu_threshold
from static.python.testN2 import apply_kmeans
from static.python.testN2 import reconstruct_image
from static.python.testN31 import level3_texture_clustering_overlay_1
from static.python.testN32 import level3_texture_clustering_overlay_2
from static.python.testN33 import level3_texture_clustering_overlay_3
from static.python.testN33 import remove_third_cluster
from static.python.testN4 import level4_combined_clustering_overlay 


def stratigraphic_profile(image_path):

    inicio = time.time()

    print(f"Intentando cargar la imagen desde la ruta: {image_path}")
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Failed to load image from path: {image_path}")
    
    print("Nivel 1: Umbralización básica utilizando el método de Otsu para segmentar áreas relevantes.")
    original_image, gray_image, binary_image = otsu_threshold(image)

    print("Nivel 2: Clustering basado en color usando K-Means y espacios de color (RGB, HSV, Lab).")
    # Convertir imagen a RGB para su correcta visualización con Matplotlib
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 
    pixels_rgb = image_rgb.reshape((-1, 3))
    
    # Convertir la imagen a HSV y Lab para K-Means
    image_hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    pixels_hsv = image_hsv.reshape((-1, 3))
    
    image_lab = cv2.cvtColor(image, cv2.COLOR_BGR2Lab)
    pixels_lab = image_lab.reshape((-1, 3))
    
    # Usar un número fijo de clusters para K-Means
    n_clusters = 20
    
    # Aplicar K-Means
    labels_rgb, centers_rgb = apply_kmeans(pixels_rgb, n_clusters)
    labels_hsv, centers_hsv = apply_kmeans(pixels_hsv, n_clusters)
    labels_lab, centers_lab = apply_kmeans(pixels_lab, n_clusters)
    
    # Reconstruir las imágenes segmentadas
    segmented_image_rgb = reconstruct_image(labels_rgb, centers_rgb, image_rgb.shape)
    segmented_image_hsv = reconstruct_image(labels_hsv, centers_hsv, image.shape)
    segmented_image_lab = reconstruct_image(labels_lab, centers_lab, image_rgb.shape)

    print("Nivel 3: Clustering basado en textura con patrones binarios locales (LBP) combinados con K-Means.")
    n_clusters = 3
    radius = 3
    n_points = 24
    min_segment_size = 81

    # Con ruido
    overlay_level3_1 = level3_texture_clustering_overlay_1(image, n_clusters, radius, n_points)
    # Sin ruido (puntos mínimos)
    overlay_level3_2 = level3_texture_clustering_overlay_2(image, n_clusters, radius, n_points, min_segment_size)
    # Sin ruido (eliminación de cluster)
    segmented_image = level3_texture_clustering_overlay_3(image, n_clusters, radius, n_points)
    overlay_level3_3 = remove_third_cluster(image, segmented_image)

    print("Nivel 4: Clustering Usando Color (RGB, HSV, Lab) y Textura (LBP) combiando con K-Means.")
    n_clusters = 25

    # Generar superposiciones para cada espacio de color
    overlay_rgb = level4_combined_clustering_overlay(image_rgb, n_clusters, 'rgb', radius, n_points)
    overlay_hsv = level4_combined_clustering_overlay(image_rgb, n_clusters, 'hsv', radius, n_points)
    overlay_lab = level4_combined_clustering_overlay(image_rgb, n_clusters, 'lab', radius, n_points)

    fin = time.time()
    print(f"Tiempo de ejecucion: {fin - inicio} segundos")

    return original_image, gray_image, binary_image, segmented_image_rgb, segmented_image_hsv, segmented_image_lab, overlay_level3_1, overlay_level3_2, overlay_level3_3, overlay_rgb, overlay_hsv, overlay_lab


if __name__ == "__main__":
    
    # Solicitar la ruta de la imagen al usuario
    image_path = input("Por favor ingrese la ruta de la imagen: ")

    try:
        # Llamar a la función para obtener los resultados
        original_image, gray_image, binary_image, segmented_image_rgb, segmented_image_hsv, segmented_image_lab, overlay_level3_1, overlay_level3_2, overlay_level3_3, overlay_rgb, overlay_hsv, overlay_lab = stratigraphic_profile(image_path)

        # Mostrar todas las imágenes procesadas
        # Para mostrar imágenes usando matplotlib, OpenCV usa el formato BGR, por lo que simplemente las mostramos directamente
        plt.figure(figsize=(12, 12))

        # Mostrar imagen original
        plt.subplot(4, 3, 1)
        plt.imshow(original_image)
        plt.title("Original")
        plt.axis('off')

        # Mostrar imagen en escala de grises
        plt.subplot(4, 3, 2)
        plt.imshow(gray_image, cmap='gray')
        plt.title("Grayscale")
        plt.axis('off')

        # Mostrar imagen binarizada
        plt.subplot(4, 3, 3)
        plt.imshow(binary_image, cmap='gray')
        plt.title("Binary")
        plt.axis('off')

        # Mostrar imagen segmentada RGB
        plt.subplot(4, 3, 4)
        plt.imshow(segmented_image_rgb)
        plt.title("Segmented RGB")
        plt.axis('off')

        # Mostrar imagen segmentada HSV
        plt.subplot(4, 3, 5)
        plt.imshow(segmented_image_hsv)
        plt.title("Segmented HSV")
        plt.axis('off')

        # Mostrar imagen segmentada Lab
        plt.subplot(4, 3, 6)
        plt.imshow(segmented_image_lab)
        plt.title("Segmented Lab")
        plt.axis('off')

        # Mostrar overlay level 3.1
        plt.subplot(4, 3, 7)
        plt.imshow(overlay_level3_1)
        plt.title("Overlay Level 3.1")
        plt.axis('off')

        # Mostrar overlay level 3.2
        plt.subplot(4, 3, 8)
        plt.imshow(overlay_level3_2)
        plt.title("Overlay Level 3.2")
        plt.axis('off')

        # Mostrar overlay level 3.3
        plt.subplot(4, 3, 9)
        plt.imshow(overlay_level3_3)
        plt.title("Overlay Level 3.3")
        plt.axis('off')

        # Mostrar overlay RGB
        plt.subplot(4, 3, 10)
        plt.imshow(overlay_rgb)
        plt.title("Overlay RGB")
        plt.axis('off')

        # Mostrar overlay HSV
        plt.subplot(4, 3, 11)
        plt.imshow(overlay_hsv)
        plt.title("Overlay HSV")
        plt.axis('off')

        # Mostrar overlay Lab
        plt.subplot(4, 3, 12)
        plt.imshow(overlay_lab)
        plt.title("Overlay Lab")
        plt.axis('off')

        # Mostrar todas las imágenes juntas
        plt.tight_layout()
        plt.show()

    except Exception as e:
        print(f"Ocurrió un error: {e}")
