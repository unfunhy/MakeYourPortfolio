import os
from dotenv import load_dotenv
load_dotenv(verbose=True)

def set_config(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
    app.config["JWT_SECRET_KEY"] = os.getenv("secret_key")
    app.config["MYSQL_FILEDATA_DIR"] = os.getenv("MYSQL_FILEDATA_DIR")
    app.secret_key = os.getenv("secret_key")