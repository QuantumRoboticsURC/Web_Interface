import numpy as np
from sklearn.cluster import KMeans
from skimage import feature, color
from skimage.util import img_as_ubyte

def level3_texture_clustering_overlay_1(image, n_clusters, radius, n_points):
    # Convertir la imagen a escala de grises
    gray_image = color.rgb2gray(image)
    
    # Asegurarse de que la imagen esté en formato uint8
    gray_image_uint8 = img_as_ubyte(gray_image)

    # Extraer características de textura con LBP
    lbp = feature.local_binary_pattern(gray_image_uint8, n_points, radius, method='uniform')
    lbp_flat = lbp.reshape(-1, 1).astype(np.float32)

    # Aplicar K-Means para hacer clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(lbp_flat)

    # Reshape de las etiquetas de KMeans a la forma de la imagen original
    segmented_image = labels.reshape(gray_image.shape[0], gray_image.shape[1])

    # Crear la superposición con color
    overlay = color.label2rgb(segmented_image, image=image, bg_label=0, alpha=0.3)

    return overlay