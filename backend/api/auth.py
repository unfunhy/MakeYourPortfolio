from flask import request, jsonify, session, Response, Blueprint, make_response
from flask_bcrypt import Bcrypt
from enum import IntEnum

from models import User
from db_connect import db

auth = Blueprint('auth', __name__, url_prefix='/api')
bcrypt = Bcrypt()


class Error(IntEnum):
    INVALID_DATA = 0
    DUPLICATE_ID = 1


error_msg = [
    "올바르지 않은 아이디 혹은 비밀번호입니다.",
    "이미 존재하는 아이디 입니다."
]


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        login_user = session.get("user_id")
        if login_user is not None:
            return jsonify({ "user_id": login_user }), 200
        else:
            return jsonify({}), 200
    else:
        #invalide id, pw, sql injection등은 front에서 처리
        user_id = request.json.get("user_id")
        user_pw = request.json.get("user_pw")

        if ";" in user_id or "--" in user_id:
            return jsonify({ "message": error_msg[Error.INVALID_DATA] }), 403

        user = db.session.query(User).filter(User.id == user_id).first()

        if user is not None:
            if bcrypt.check_password_hash(user_pw, user.user_pw):
                session['user_id'] = user_id
                return jsonify({ "user_id": user_id }), 200

        return jsonify({ "message": error_msg[Error.INVALID_DATA] }), 401


@auth.route("/register", methods=["POST"])
def register():
    #invalide id, pw, sql injection등은 front에서 처리
    user_id = request.json.get("user_id")
    raw_password = request.json.get("user_pw")
    user_pw = bcrypt.generate_password_hash(raw_password)

    if db.session.query(User).filter(User.user_id == user_id).first():
        return make_response(jsonify({
            "message": error_msg[Error.DUPLICATE_ID]
        }), status=409
        )

    db.session.add(User(user_id, user_pw))
    db.session.commit()

    return make_response(jsonify({
        "result": "success"
        }), status=201
    )


@auth.route("/logout", methods=["GET"])
def logout():
    session["user_id"] = None
    return make_response(jsonify({
        "result": "success"
        }), status=200
    )
