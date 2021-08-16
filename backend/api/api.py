from flask import request, jsonify, session
from flask_bcrypt import Bcrypt

from app import app
from models import User, Education, Award, Project, Certificate
from db_connect import db

@app.route("/portfolio", methods=["GET"])
def get_portfolio(id):
    pass

@app.route("/portfolio", methods=["PATCH"])
def update_portfolio(id):
    pass

@app.route("/network", methods=["GET"])
def get_network(search_data):
    pass