from flask import current_app, request, jsonify, Blueprint, abort
from flask_bcrypt import Bcrypt
from enum import IntEnum

from models import User
from db_connect import db
from AuthManager import createToken, jwt_required


auth = Blueprint('auth', __name__, url_prefix="/api")
bcrypt = Bcrypt()


class Error(IntEnum):
    INVALID_DATA = 0
    DUPLICATE_ID = 1
    INTERNAL_DB_ERROR = 2


error_msg = [
    "올바르지 않은 아이디 혹은 비밀번호입니다.",
    "이미 존재하는 아이디 입니다.",
    "내부 서버 오류입니다. 오류가 지속될 시 문의 바랍니다."
]

# 유저 id, name 확인용 api
# token이 유효할 시 id, name 리턴
@auth.route("/login", methods=['GET'])
@jwt_required
def get_user_id(id):
    user = db.session.query(User.id, User.name).filter(User.id == id).first()
    return {"id": user[0], "name": user[1]}, 200

# 유저 로그인(토큰 생성) api
@auth.route("/login", methods=['POST'])
def login():
    user_id = request.json.get("user_id")
    user_pw = request.json.get("user_pw")

    # SQL injection은 FE에서 방지하지만 혹시 몰라 한 번 더 확인
    if ";" in user_id or "--" in user_id:
        return abort(403, error_msg[Error.INVALID_DATA])

    user = User.query.filter(User.user_id == user_id).first()
    if user is not None:
        if bcrypt.check_password_hash(user.user_pw, user_pw):
            return {
                "Authorization": createToken(user.id),
                "id": user.id,
                "name": user.name
            }, 200

    return abort(401, error_msg[Error.INVALID_DATA])


# 회원가입 시 중복 아이디 확인용 api
@auth.route("/register", methods=["GET"])
def check_user_id():
    user_id = request.args.get("user_id")
    if User.query.filter(User.user_id == user_id).first():
        return abort(409, error_msg[Error.DUPLICATE_ID])
    return '', 200


# 회원가입 api
@auth.route("/register", methods=["POST"])
def register():
    user_id = request.json.get("user_id")
    raw_password = request.json.get("user_pw")
    user_pw = bcrypt.generate_password_hash(raw_password)
    name = request.json.get("name")

    if User.query.filter(User.user_id == user_id).first():
        return abort(409, error_msg[Error.DUPLICATE_ID])

    db.session.add(User(user_id, user_pw, name))
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 201

# logout => 클라이언트에서 Token 삭제
