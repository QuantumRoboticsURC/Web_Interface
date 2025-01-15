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

application = Flask(__name__, static_url_path='/static')
random.seed
UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)



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

@application.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found in request"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Guardar la imagen temporalmente
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Procesar la imagen
        stratigraphic_profile(file_path)

        # (Opcional) Si el procesamiento genera una imagen de salida, envíala al cliente
        result_path = os.path.join(RESULT_FOLDER, "output.png")  # Ajusta según el resultado de tu procesamiento
        if os.path.exists(result_path):
            return send_file(result_path, mimetype='image/png')

        return jsonify({"success": "Image processed successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Limpia archivos temporales
        if os.path.exists(file_path):
            os.remove(file_path)
            
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
