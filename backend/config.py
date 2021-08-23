import os
import app
from dotenv import load_dotenv
load_dotenv(verbose=True)

def find_mysql_path(s):
    if s.find("MySQL Server") != -1:
        return s

def set_config():
    app.app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
    app.app.config["JWT_SECRET_KEY"] = os.getenv("secret_key")
    app.app.config["MYSQL_FILEDATA_DIR"] = os.getenv("MYSQL_FILEDATA_DIR")

    app.app.secret_key = os.getenv("secret_key")