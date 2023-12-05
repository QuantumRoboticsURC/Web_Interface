#!/usr/bin/env python
import json
import random
import time
from datetime import datetime
from os import listdir
from os.path import isfile, join

from flask import Flask, Response, render_template, jsonify

application = Flask(__name__, static_url_path='/static')
random.seed()

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/lab')
def ciencias():
    return render_template('laboratory.html')

@application.route('/arm_lab')
def arm_lab():
    return render_template('arm_lab.html')

@application.route('/rocks')
def rocks():
    return render_template('rocks.html')

@application.route('/metrics')
def metrics():
    return render_template('metrics.html')    

@application.route('/arm')
def arm():
    return render_template('arm.html')    

@application.route('/coordinates')
def coordinates():
    return render_template('coordinates.html') 

@application.route('/strat_profile')
def strat_profile():
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