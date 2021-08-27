import sys
sys.path.append("./api")

from config import set_config
from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from db_connect import db
from auth import auth
from api import portfolio


app = Flask(__name__, static_folder="statics/images")
CORS(app)

set_config(app)

app.register_blueprint(auth)
app.register_blueprint(portfolio)

db.init_app(app)
bcrypt = Bcrypt(app)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
