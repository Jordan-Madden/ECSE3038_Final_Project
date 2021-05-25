'''
    Author: Jordan Madden
    Description: ECSE3038 Final Project
'''

from marshmallow import Schema, fields, ValidationError
from flask_socketio import SocketIO, send
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
from datetime import datetime
from flask_cors import CORS
from json import load, loads
import pandas as pd

app = Flask(__name__)
CORS(app)

username = pd.read_csv("db_credentials.csv").columns[0]
password = pd.read_csv("db_credentials.csv").columns[1]
mongo_uri = "mongodb+srv://{}:{}@cluster0.weykq.mongodb.net/monday?retryWrites=true&w=majority".format(username, password)
app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)

socketio = SocketIO(app)

class RecordSchema(Schema):
    patient_id = fields.String(required=True)
    position = fields.Integer(required=True)
    temperature = fields.Integer(required=True)
    last_updated = fields.String(required=True)

class PatientSchema(Schema):
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    age = fields.Integer(required=True)
    patient_id = fields.String(required=True)

@app.route("/api/patient", methods=["GET"])
def get_all_patient_data():
    '''
        This route returns all of the patient objects stored in the 
        database
    '''
    patients = mongo.db.patients.find()
    return jsonify(loads(dumps(patients))) 


@app.route("/api/patient/<id>", methods=["GET"])
def get_single_patient_data(id):
    '''
        This route returns a single patient object that is stored in 
        the database
    '''
    patient = mongo.db.patients.find_one({"patient_id": id})
    return jsonify(loads(dumps(patient)))

@app.route("/api/patient", methods=["POST"])
def post_patient_data():
    '''
        This route handles the POST requests made to the server by the 
        frontend 
    '''
    try:
        now = datetime.now()
        dt = now.strftime("%d/%m/%Y %H:%M:%S")

        first_name = request.json["first_name"]
        last_name = request.json["last_name"]
        age = request.json["age"]
        patient_id = request.json["patient_id"]

        jsonBody = {
            "first_name": first_name,
            "last_name": last_name,
            "age": age,
            "patient_id": patient_id
        }

        print(jsonBody)

        patient_data = PatientSchema().load(jsonBody)
        mongo.db.patients.insert_one(patient_data)

        return{
            "success": True,
            "message": "Data saved successfully",
            "date": dt
        }

    except ValidationError as e:
        return e.messages, 400

@app.route("/api/patient/<id>", methods=["PATCH"])
def patch_patient_data(id):
    '''
        This route handles the PATCH requests made to the server by the 
        frontend 
    '''
    mongo.db.patients.update_one({"patient_id": id}, {"$set": request.json})
    patient = mongo.db.patients.find_one({"patient_id": id})

    return loads(dumps(patient))

@app.route("/api/patient/<id>", methods=["DELETE"])
def delete_patient_data(id):
    '''
        This route handles the DELETE requests made to the server by the 
        frontend 
    '''
    result = mongo.db.patients.delete_one({"patient_id": id})

    if result.deleted_count == 1:
        return {
            "success": True,
        }
    else:
        return{
            "success": False,
        }, 400

@app.route("/api/record/<id>", methods=["GET"])
def get_single_record_data(id):
    '''
        This route handles the individual GET requests made to the server by the 
        frontend. It gets the record data so that the position of a patient can
        be determined and displayed in the frontend
    '''
    record = mongo.db.records.find_one({"patient_id":id})
    print(record)
    return jsonify(loads(dumps(record))) 

@app.route("/api/record", methods=["POST"])
def post_record_data():
    '''
        This route handles the POST requests made to the server by the 
        embedded client
    '''
    try:
        now = datetime.now()
        dt = now.strftime("%d/%m/%Y %H:%M:%S")

        patient_id = request.json["patient_id"]
        position = request.json["position"]
        temperature = request.json["temperature"]
        last_updated = dt

        jsonBody = {
            "patient_id": patient_id,
            "position": position,
            "temperature": temperature,
            "last_updated": last_updated
        }

        record_data = RecordSchema().load(jsonBody)
        mongo.db.records.insert_one(record_data)

        print(jsonBody)

        return {
            "success": True,
            "msg": "data saved successfully",
            "date": dt
        }
    except ValidationError as e:
        return e.messages, 400

if __name__ == "__main__":
    app.run(
        debug=True,
        host="192.168.1.6",
        port=5000
    )