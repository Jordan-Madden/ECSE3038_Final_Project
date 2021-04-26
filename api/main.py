'''
    Author: Jordan Madden
    Description: ECSE3038 Final Project
'''

from marshmallow import Schema, fields, ValidationError
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

class PatientSchema(Schema):
    patient_id = fields.String(required=True)
    position = fields.Integer(required=True)
    temperature = fields.Integer(required=True)

@app.route("/data")
def get_patient_data():
    patients = mongo.db.patients.find()
    return jsonify(loads(dumps(patients))) 

@app.route("/data", methods=["POST"])
def post_patient_data():
    try:
        patient_id = request.json["patient_id"]
        position = request.json["position"]
        temperature = request.json["temperature"]

        jsonBody = {
            "patient_id": patient_id,
            "position": position,
            "temperature": temperature
        }

        patient_data = PatientSchema().load(jsonBody)
        mongo.db.patients.insert_one(patient_data)

        now = datetime.now()
        dt = now.strftime("%d/%m/%Y %H:%M:%S")

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
        host="192.168.1.7",
        port=5000
    )