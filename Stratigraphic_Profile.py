import cv2
import matplotlib.pyplot as plt
import time 

from test import show_image 
from testN2 import apply_kmeans
from testN2 import reconstruct_image
from testN31 import level3_texture_clustering_overlay_1
from testN32 import level3_texture_clustering_overlay_2
from testN33 import level3_texture_clustering_overlay_3
from testN33 import remove_third_cluster
from testN4 import level4_combined_clustering_overlay   

def stratigraphic_profile(image):
    inicio = time.time()
    image_path = image  # Reemplaza con tu ruta de imagen
    image = cv2.imread(image_path)

    #################################################################################################
    ###Nivel 1: Umbralización básica utilizando el método de Otsu para segmentar áreas relevantes.###
    #################################################################################################

    #Hace le umbralización y muestra el resiltado
    show_image(image)



    #############################################################################################
    ###Nivel 2: Clustering basado en color usando K-Means y espacios de color (RGB, HSV, Lab).###
    #############################################################################################

    # Convertir la imagen a RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) 

    # Convertir la imagen a una lista de píxeles (RGB)
    pixels = image_rgb.reshape((-1, 3))

    # Convertir a otros espacios de color
    image_hsv = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2HSV)
    pixels_hsv = image_hsv.reshape((-1, 3))

    image_lab = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2Lab)
    pixels_lab = image_lab.reshape((-1, 3))

    # Usar un número fijo de clusters
    n_clusters = 20

    # Aplicar K-Means en cada espacio de color
    labels_rgb, centers_rgb = apply_kmeans(pixels, n_clusters)
    labels_hsv, centers_hsv = apply_kmeans(pixels_hsv, n_clusters)
    labels_lab, centers_lab = apply_kmeans(pixels_lab, n_clusters)

    # Reconstruir las imágenes segmentadas
    segmented_image_rgb = reconstruct_image(labels_rgb, centers_rgb, image_rgb.shape)
    segmented_image_hsv = reconstruct_image(labels_hsv, centers_hsv, image_rgb.shape)
    segmented_image_lab = reconstruct_image(labels_lab, centers_lab, image_rgb.shape)

    # Mostrar los resultados
    plt.figure(figsize=(20, 10))
    plt.title(f"Color-Based Clustering\nClusters: {n_clusters}\n")
    plt.axis("off")

    # Imagen original
    plt.subplot(2, 2, 1)
    plt.imshow(image_rgb)
    plt.title("Original")
    plt.axis('off')

    # Imagen segmentada en RGB
    plt.subplot(2, 2, 2)
    plt.imshow(segmented_image_rgb)
    plt.title("RGB")
    plt.axis('off')

    # Imagen segmentada en HSV
    plt.subplot(2, 2, 3)
    plt.imshow(segmented_image_hsv)
    plt.title("HSV")
    plt.axis('off')

    # Imagen segmentada en Lab
    plt.subplot(2, 2, 4)
    plt.imshow(segmented_image_lab)
    plt.title("Lab")
    plt.axis('off')

    plt.tight_layout()
    plt.show()



    #######################################################################################################
    ###Nivel 3: Clustering basado en textura con patrones binarios locales (LBP) combinados con K-Means.###
    #######################################################################################################
    
    ################
    ###Parámetros###
    ################

    n_clusters = 3         # Número de clusters
    radius = 3             # Radio de LBP
    n_points = 24          # Número de puntos de LBP
    min_segment_size = 81  # Tamaño mínimo de segmento para mantener

    ##############################
    ###SIN ELIMINACIÓN DE RUIDO###
    ##############################

    # Aplicar el nivel 3 con los parámetros dados
    overlay_level3_1 = level3_texture_clustering_overlay_1(image, n_clusters, radius, n_points)

    ######################################################
    ###CON ELIMINACIÓN DE RUIDO MEDIANTE PUNTOS MÍNIMOS###
    ######################################################

    # Aplicar el nivel 3 con los parámetros dados
    overlay_level3_2 = level3_texture_clustering_overlay_2(image, n_clusters, radius, n_points, min_segment_size)
    
    #######################################################################
    #CON ELIMINACIÓN DE RUIDO MEDIANTE LA ELIMINACIÓN DEL TERCER CLUSTER###
    #######################################################################

    # Aplicar el nivel 3 con los parámetros dados
    segmented_image = level3_texture_clustering_overlay_3(image, n_clusters, radius, n_points)

    # Eliminar el tercer cluster
    overlay_level3_3 = remove_third_cluster(image, segmented_image)

    ################
    ###Resultados###
    ################

    plt.figure(figsize=(20, 10))
    plt.title(f"\nTexture-Based Clustering\n Clusters: {n_clusters}, Radius: {radius}, Points: {n_points}, Minimum Points: {min_segment_size}\n")
    plt.axis("off")

    # Imagen original
    plt.subplot(2, 2, 1)
    plt.imshow(image_rgb)
    plt.title("Original")
    plt.axis('off')

    # Imagen segmentada sin eliminación de ruido
    plt.subplot(2, 2, 2)
    plt.imshow(overlay_level3_1)
    plt.title('Without Noise Removal')
    plt.axis('off')

    # Imagen segmentada con eliminación de ruido mediante puntos mínimos
    plt.subplot(2, 2, 3)
    plt.imshow(overlay_level3_2)
    plt.title('With Noise Removal by Minimum Points')
    plt.axis('off')

    # Imagen segmentada con eliminación de ruido mediante la eliminación del tercer cluster
    plt.subplot(2, 2, 4)
    plt.imshow(overlay_level3_3)
    plt.title('With Noise Removal by Removing the Third Cluster \n(index 2)')
    plt.axis('off')

    plt.tight_layout()
    plt.show()



    #############################################################################################
    ###Nivel 4: Clustering Usando Color (RGB, HSV, Lab) y Textura (LBP) combiando con K-Means.###
    #############################################################################################

    #Cambio de número de clusters para mejores resultados
    n_clusters = 25

    # Generar superposiciones para cada espacio de color
    overlay_rgb = level4_combined_clustering_overlay(image_rgb, n_clusters, 'rgb', radius, n_points)
    overlay_hsv = level4_combined_clustering_overlay(image_rgb, n_clusters, 'hsv', radius, n_points)
    overlay_lab = level4_combined_clustering_overlay(image_rgb, n_clusters, 'lab', radius, n_points)

    # Mostrar las imágenes
    plt.figure(figsize=(20, 10))
    plt.title(f"\nClustering Based on Color and Texture\nClusters: {n_clusters}\n")
    plt.axis("off")

    # Imagen original
    plt.subplot(2, 2, 1)
    plt.imshow(image_rgb)
    plt.title("Original")
    plt.axis('off')

    # Segmentación RGB
    plt.subplot(2, 2, 2)
    plt.imshow(overlay_rgb)
    plt.title("RGB")
    plt.axis('off')

    # Segmentación HSV
    plt.subplot(2, 2, 3)
    plt.imshow(overlay_hsv)
    plt.title("HSV")
    plt.axis('off')

    # Segmentación Lab
    plt.subplot(2, 2, 4)
    plt.imshow(overlay_lab)
    plt.title("Lab")
    plt.axis('off')

    plt.tight_layout()
    plt.show()
    fin= time.time()

    print(f"Tiempo de ejecucion: {fin - inicio} segundos")
