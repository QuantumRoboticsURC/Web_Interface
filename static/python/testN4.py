import numpy as np
from sklearn.cluster import KMeans
from skimage import feature, color
from skimage.util import img_as_ubyte

def level4_combined_clustering_overlay(image, n_clusters, color_space, radius, n_points):
    # Convertir al espacio de color especificado
    if color_space == 'rgb':
        image_cs = image
    elif color_space == 'hsv':
        image_cs = color.rgb2hsv(image)
    elif color_space == 'lab':
        image_cs = color.rgb2lab(image)
    else:
        raise ValueError('Espacio de color desconocido.')

    # Preparar datos de color
    pixels = image_cs.reshape(-1, image_cs.shape[2])

    # Convertir la imagen a escala de grises para la textura
    gray_image = color.rgb2gray(image)

    # Asegurarse de que la imagen esté en formato uint8
    gray_image_uint8 = img_as_ubyte(gray_image)

    # Extraer características de textura con LBP
    lbp = feature.local_binary_pattern(gray_image_uint8, n_points, radius, method='uniform')
    lbp_flat = lbp.reshape(-1, 1).astype(np.float32)

    # Combinar características de color y textura
    features = np.hstack((pixels, lbp_flat))

    # Aplicar K-Means para hacer clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(features)

    # Reconstruir la imagen segmentada
    segmented_image = labels.reshape(image.shape[0], image.shape[1])

    # Crear una superposición de colores con la segmentación
    overlay = color.label2rgb(segmented_image, image=image, bg_label=0, alpha=0.3)

    return overlay

