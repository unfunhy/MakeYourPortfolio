import os
import sys
sys.path.append("./api")
from dotenv import load_dotenv
load_dotenv(verbose=True)

from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from db_connect import db
from auth import auth
from api import portfolio


app = Flask(__name__)
CORS(app)

app.register_blueprint(auth)
app.register_blueprint(portfolio)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
app.config["JWT_SECRET_KEY"] = os.getenv("secret_key")
app.secret_key = os.getenv("secret_key")

db.init_app(app)
bcrypt = Bcrypt(app)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
