from flask import request, jsonify, session, Response, Blueprint
from flask_bcrypt import Bcrypt

from models import User
from db_connect import db

auth = Blueprint('', __name__)
bcrypt = Bcrypt()

@auth.route("/login", methods=['POST'])
def login():
    #invalide id, pw, sql injection등은 front에서 처리
    user_id = request.json.get("user_id")
    user_pw = request.json.get("user_pw")

    if ";" in user_id or "--" in user_id:
        return Response('', status=403)

    user = db.session.query(User).filter(User.id == user_id).first()

    if user is not None:
        if bcrypt.check_password_hash(user_pw, user.user_pw):
            session['user_id'] = user_id
            return Response('', status=200)

    return Response('', status=401)

@auth.route("/register", methods=["POST"])
def register():
    #invalide id, pw, sql injection등은 front에서 처리
    user_id = request.json.get("user_id")
    raw_password = request.json.get("user_pw")
    user_pw = bcrypt.generate_password_hash(raw_password)

    if User.filter(User.id == user_id).first():
        return Response({
            "reason": "이미 존재하는 아이디 입니다."
            }, status=201
        )
    
    db.session.add(User(user_id, user_pw))
    db.session.commit()
    return Response({"result": "success"})

@auth.route("/logout", methods=["GET"])
def logout():
    session["user_id"] = None
    return