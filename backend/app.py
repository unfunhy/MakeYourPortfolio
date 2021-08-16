import sys
sys.path.append("./api")

from flask import Flask
from flask_bcrypt import Bcrypt

from db_connect import db
from auth import auth


app = Flask(__name__)
app.register_blueprint(auth)

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:asdf1234@127.0.0.1:3306/elice_portfolio"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'elice-portfolio-secret-key-unfunhy/_tE#)*m1pU3$aX56l^$%'

db.init_app(app)
bcrypt = Bcrypt(app)

if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
