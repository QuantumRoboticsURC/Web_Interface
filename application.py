#!/usr/bin/env python
import json
import random
import time
import sqlite3
from datetime import datetime
from os import listdir
from os.path import isfile, join
from flask import Flask, Response, render_template, jsonify, g, request, redirect, url_for, send_file
from db_actions.rock_db import *
import sys
from static.python.Stratigraphic_Profile import stratigraphic_profile
from static.python.extra import normalize_and_save_image, convert_to_8bit
import	cv2
import os

application = Flask(__name__, static_url_path='/static')
random.seed
UPLOAD_FOLDER_SITE_1 = 'static/uploads/site_1'
UPLOAD_FOLDER_SITE_2 = 'static/uploads/site_2'
PROCESSED_FOLDER_SITE_1 = 'static/processed/site_1'
PROCESSED_FOLDER_SITE_2 = 'static/processed/site_2'

os.makedirs(UPLOAD_FOLDER_SITE_1, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_SITE_2, exist_ok=True)
os.makedirs(PROCESSED_FOLDER_SITE_1, exist_ok=True)
os.makedirs(PROCESSED_FOLDER_SITE_2, exist_ok=True)


########################################################################################################
########################################################################################################
########################################################################################################

@application.route('/rocks', methods = ['GET', 'POST'])
def rocks():
    if request.method == 'POST':
        return create_rock()
    elif request.args.get("del_rock") :
        return delete_rock()
    rocks, categories = gather_rocks()
    return render_template('rocks.html', rocks=rocks, rock_types=categories['types'], textures=categories['textures'], colors=categories['colors'], minerals=categories['minerals'])
    



########################################################################################################
########################################################################################################
########################################################################################################

@application.route('/analyze_site_1', methods=['POST'])
def analyze_site_1():
    if 'image_site_1' not in request.files:
        return 'No file part', 400
    
    file = request.files['image_site_1']
    
    if file.filename == '':
        return 'No selected file', 400

    if file:
        sanitized_filename = "imageSite1.jpg"
        image_path = os.path.join(UPLOAD_FOLDER_SITE_1, sanitized_filename)
        file.save(image_path)

    # Lista para almacenar las URLs de las imágenes procesadas
    processed_images_site_1 = []

    try:

        # Aquí estamos procesando la imagen en diferentes pasos
        original_image, gray_image, binary_image, segmented_image_rgb, segmented_image_hsv, segmented_image_lab, overlay_level3_1, overlay_level3_2, overlay_level3_3, overlay_rgb, overlay_hsv, overlay_lab = stratigraphic_profile(image_path)

        # Convertir las imágenes a 8 bits y asegurarse que están en formato RGB
        original_image = convert_to_8bit(original_image)
        binary_image = convert_to_8bit(binary_image)
        segmented_image_rgb = convert_to_8bit(segmented_image_rgb)
        segmented_image_hsv = convert_to_8bit(segmented_image_hsv)
        segmented_image_lab = convert_to_8bit(segmented_image_lab)
        
        # Convertir a formato RGB (opcional si es necesario)
        original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        binary_image = cv2.cvtColor(binary_image, cv2.COLOR_BGR2RGB)
        segmented_image_rgb = cv2.cvtColor(segmented_image_rgb, cv2.COLOR_BGR2RGB)
        segmented_image_hsv = cv2.cvtColor(segmented_image_hsv, cv2.COLOR_BGR2RGB)
        segmented_image_lab = cv2.cvtColor(segmented_image_lab, cv2.COLOR_BGR2RGB)

        # Guardar las imágenes procesadas en el orden
        processed_image_path_original = os.path.join(PROCESSED_FOLDER_SITE_1, f"original_{sanitized_filename}")
        processed_image_path_gray = os.path.join(PROCESSED_FOLDER_SITE_1, f"gray_{sanitized_filename}")
        processed_image_path_binary = os.path.join(PROCESSED_FOLDER_SITE_1, f"binary_{sanitized_filename}")
        
        normalize_and_save_image(original_image, processed_image_path_original)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/original_{sanitized_filename}'))

        normalize_and_save_image(gray_image, processed_image_path_gray)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/gray_{sanitized_filename}'))

        normalize_and_save_image(binary_image, processed_image_path_binary)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/binary_{sanitized_filename}'))

        # Guardar las imágenes segmentadas
        segmented_path_rgb = os.path.join(PROCESSED_FOLDER_SITE_1, f"segmented_rgb_{sanitized_filename}")
        segmented_path_hsv = os.path.join(PROCESSED_FOLDER_SITE_1, f"segmented_hsv_{sanitized_filename}")
        segmented_path_lab = os.path.join(PROCESSED_FOLDER_SITE_1, f"segmented_lab_{sanitized_filename}")
        
        normalize_and_save_image(segmented_image_rgb, segmented_path_rgb)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/segmented_rgb_{sanitized_filename}'))

        normalize_and_save_image(segmented_image_hsv, segmented_path_hsv)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/segmented_hsv_{sanitized_filename}'))

        normalize_and_save_image(segmented_image_lab, segmented_path_lab)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/segmented_lab_{sanitized_filename}'))

        # Guardar las imágenes de overlay
        overlay_path_level3_1 = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_level3_1_{sanitized_filename}")
        overlay_path_level3_2 = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_level3_2_{sanitized_filename}")
        overlay_path_level3_3 = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_level3_3_{sanitized_filename}")
        
        normalize_and_save_image(overlay_level3_1, overlay_path_level3_1)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_level3_1_{sanitized_filename}'))

        normalize_and_save_image(overlay_level3_2, overlay_path_level3_2)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_level3_2_{sanitized_filename}'))

        normalize_and_save_image(overlay_level3_3, overlay_path_level3_3)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_level3_3_{sanitized_filename}'))

        # Guardar las imágenes de overlay combinadas con color
        overlay_path_rgb = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_rgb_{sanitized_filename}")
        overlay_path_hsv = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_hsv_{sanitized_filename}")
        overlay_path_lab = os.path.join(PROCESSED_FOLDER_SITE_1, f"overlay_lab_{sanitized_filename}")
        
        normalize_and_save_image(overlay_rgb, overlay_path_rgb)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_rgb_{sanitized_filename}'))

        normalize_and_save_image(overlay_hsv, overlay_path_hsv)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_hsv_{sanitized_filename}'))

        normalize_and_save_image(overlay_lab, overlay_path_lab)
        processed_images_site_1.append(url_for('static', filename=f'processed/site_1/overlay_lab_{sanitized_filename}'))

    except Exception as e:
        print(f"Error durante el procesamiento de la imagen: {e}")
    finally:
        cv2.destroyAllWindows()

    # Regresar la lista de imágenes procesadas para este sitio
    return render_template('strat_profile.html', images_site_1=processed_images_site_1)

@application.route('/analyze_site_2', methods=['POST'])
def analyze_site_2():
    if 'image_site_2' not in request.files:
        return 'No file part', 400
    
    file = request.files['image_site_2']
    
    if file.filename == '':
        return 'No selected file', 400

    if file:
        sanitized_filename = "imageSite2.jpg"
        image_path = os.path.join(UPLOAD_FOLDER_SITE_2, sanitized_filename)
        file.save(image_path)

    processed_images_site_2 = []

    try:

    # Aquí estamos procesando la imagen en diferentes pasos
        original_image, gray_image, binary_image, segmented_image_rgb, segmented_image_hsv, segmented_image_lab, overlay_level3_1, overlay_level3_2, overlay_level3_3, overlay_rgb, overlay_hsv, overlay_lab = stratigraphic_profile(image_path)

        # Convertir las imágenes a 8 bits y asegurarse que están en formato RGB
        original_image = convert_to_8bit(original_image)
        binary_image = convert_to_8bit(binary_image)
        segmented_image_rgb = convert_to_8bit(segmented_image_rgb)
        segmented_image_hsv = convert_to_8bit(segmented_image_hsv)
        segmented_image_lab = convert_to_8bit(segmented_image_lab)
        
        # Convertir a formato RGB (opcional si es necesario)
        original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
        binary_image = cv2.cvtColor(binary_image, cv2.COLOR_BGR2RGB)
        segmented_image_rgb = cv2.cvtColor(segmented_image_rgb, cv2.COLOR_BGR2RGB)
        segmented_image_hsv = cv2.cvtColor(segmented_image_hsv, cv2.COLOR_BGR2RGB)
        segmented_image_lab = cv2.cvtColor(segmented_image_lab, cv2.COLOR_BGR2RGB)

        # Guardar las imágenes procesadas en el orden
        processed_image_path_original = os.path.join(PROCESSED_FOLDER_SITE_2, f"original_{sanitized_filename}")
        processed_image_path_gray = os.path.join(PROCESSED_FOLDER_SITE_2, f"gray_{sanitized_filename}")
        processed_image_path_binary = os.path.join(PROCESSED_FOLDER_SITE_2, f"binary_{sanitized_filename}")
        
        normalize_and_save_image(original_image, processed_image_path_original)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/original_{sanitized_filename}'))

        normalize_and_save_image(gray_image, processed_image_path_gray)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/gray_{sanitized_filename}'))

        normalize_and_save_image(binary_image, processed_image_path_binary)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/binary_{sanitized_filename}'))

        # Guardar las imágenes segmentadas
        segmented_path_rgb = os.path.join(PROCESSED_FOLDER_SITE_2, f"segmented_rgb_{sanitized_filename}")
        segmented_path_hsv = os.path.join(PROCESSED_FOLDER_SITE_2, f"segmented_hsv_{sanitized_filename}")
        segmented_path_lab = os.path.join(PROCESSED_FOLDER_SITE_2, f"segmented_lab_{sanitized_filename}")
        
        normalize_and_save_image(segmented_image_rgb, segmented_path_rgb)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/segmented_rgb_{sanitized_filename}'))

        normalize_and_save_image(segmented_image_hsv, segmented_path_hsv)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/segmented_hsv_{sanitized_filename}'))

        normalize_and_save_image(segmented_image_lab, segmented_path_lab)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/segmented_lab_{sanitized_filename}'))

        # Guardar las imágenes de overlay
        overlay_path_level3_1 = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_level3_1_{sanitized_filename}")
        overlay_path_level3_2 = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_level3_2_{sanitized_filename}")
        overlay_path_level3_3 = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_level3_3_{sanitized_filename}")
        
        normalize_and_save_image(overlay_level3_1, overlay_path_level3_1)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_level3_1_{sanitized_filename}'))

        normalize_and_save_image(overlay_level3_2, overlay_path_level3_2)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_level3_2_{sanitized_filename}'))

        normalize_and_save_image(overlay_level3_3, overlay_path_level3_3)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_level3_3_{sanitized_filename}'))

        # Guardar las imágenes de overlay combinadas con color
        overlay_path_rgb = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_rgb_{sanitized_filename}")
        overlay_path_hsv = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_hsv_{sanitized_filename}")
        overlay_path_lab = os.path.join(PROCESSED_FOLDER_SITE_2, f"overlay_lab_{sanitized_filename}")
        
        normalize_and_save_image(overlay_rgb, overlay_path_rgb)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_rgb_{sanitized_filename}'))

        normalize_and_save_image(overlay_hsv, overlay_path_hsv)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_hsv_{sanitized_filename}'))

        normalize_and_save_image(overlay_lab, overlay_path_lab)
        processed_images_site_2.append(url_for('static', filename=f'processed/site_2/overlay_lab_{sanitized_filename}'))

    except Exception as e:
        print(f"Error durante el procesamiento de la imagen: {e}")
    finally:
        cv2.destroyAllWindows()

    # Regresar la lista de imágenes procesadas para este sitio
    return render_template('strat_profile.html', images_site_2=processed_images_site_2)

            
@application.route('/lab')
def ciencias():
    return render_template('laboratory.html')

@application.route('/arm_lab')
def arm_lab():
    return render_template('arm_lab.html')


@application.route('/metrics')
def metrics():
    return render_template('metrics.html')    

@application.route('/arm')
def arm():
    return render_template('arm.html')

@application.route('/arm2')
def arm2():
    return render_template('arm2.html')        

@application.route('/coordinates')
def coordinates():
    return render_template('coordinates.html') 
@application.route('/coordinates2')
def coordinates2():
    return render_template('coordinates2.html') 

@application.route('/')
def index2():
    return render_template('index2.html')

# cambios rosa laboratory, stratigraphic
@application.route('/laboratory')
def laboratory():
    return render_template('laboratory.html')

@application.route('/stratigraphic')
def stratigraphic():
    return render_template('strat_profile.html')











@application.route('/data_sensor1')
def data_sensor1():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%M:%S'), 'value': random.random() + 12})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')

@application.route('/data_sensor2')
def data_sensor2():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%M:%S'), 'value': random.random() * 10})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')

@application.route('/data_sensor3')
def data_sensor3():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%M:%S'), 'value': random.random() * 10})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')


@application.route('/velocidad')
def velocidad():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%M:%S'), 'angular': random.uniform(0, 0.2)
                ,'lineal': random.uniform(0.3, 0.5)})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')

@application.route('/data_bateria')
def data_bateria():
    def generate_random_data():
        while True:
            json_data = json.dumps(
                {'time': datetime.now().strftime('%M:%S'), 'value': (random.random() / 10) + 12.5})
            yield f"data:{json_data}\n\n"
            time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')

@application.route('/get_img')
def get_img():
    lab_img = [f for f in listdir("static/img/lab/bucket") if isfile(join("static/img/lab/bucket", f))]
    return jsonify({"lab_imgs": lab_img})

application.run(debug=True, threaded=True, host='0.0.0.0', port=5001)
