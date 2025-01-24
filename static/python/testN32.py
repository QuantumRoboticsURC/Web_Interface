import numpy as np
from sklearn.cluster import KMeans
from skimage import feature, color, measure

def level3_texture_clustering_overlay_2(image, n_clusters, radius, n_points, min_segment_size=500):
    # Convertir la imagen a escala de grises
    gray_image = color.rgb2gray(image)

    # Escalar a rango [0, 255] y convertir a uint8
    gray_image = (gray_image * 255).astype(np.uint8)

    # Extraer características de textura con LBP
    lbp = feature.local_binary_pattern(gray_image, n_points, radius, method='uniform')
    lbp_flat = lbp.reshape(-1, 1).astype(np.float32)

    # Aplicar K-Means para hacer clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(lbp_flat)

    # Reshape de las etiquetas de KMeans a la forma de la imagen original
    segmented_image = labels.reshape(gray_image.shape[0], gray_image.shape[1])

    # Eliminar los segmentos pequeños (ruido)
    # Etiquetar las componentes conectadas
    labeled_segments = measure.label(segmented_image)
    region_props = measure.regionprops(labeled_segments)
    
    # Crear una máscara para los segmentos grandes
    mask = np.zeros_like(segmented_image, dtype=bool)
    for region in region_props:
        if region.area >= min_segment_size:  # Solo mantener segmentos grandes
            mask[labeled_segments == region.label] = True
    
    # Aplicar la máscara a la imagen segmentada
    cleaned_segmented_image = np.zeros_like(segmented_image)
    cleaned_segmented_image[mask] = segmented_image[mask]
    
    # Crear la superposición con color
    overlay = color.label2rgb(cleaned_segmented_image, image=image, bg_label=0, alpha=0.3)

    return overlay







