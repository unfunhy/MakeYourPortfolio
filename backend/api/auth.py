from flask import current_app, request, jsonify, Blueprint, abort
from flask_bcrypt import Bcrypt

from models import User
from db_connect import db
from AuthManager import createToken, jwt_required
from QueryManager import select_all_from_target_table
from ErrorManager import Error, error_msg


auth = Blueprint('auth', __name__, url_prefix="/api")
bcrypt = Bcrypt()


@auth.route("/login", methods=['GET'])
@jwt_required
def get_user_info(id):
    '''
    # 유저 id, name 확인용 api
    # token이 유효할 시 id, name 리턴
    '''
    user = select_all_from_target_table(User, id, User.id)
    return {"id": user.id, "name": user.name}


@auth.route("/login", methods=['POST'])
def login():
    '''
    # 유저 로그인(토큰 생성) api
    # 기본적으로 id, pw유효성은 FE에서 수행
    # 데이터 전송 도중 패킷이 위조될 위험성이 있으므로 SQL injection은 한 번 더 확인
    '''
    email = request.json.get("email")
    user_pw = request.json.get("user_pw")

    if ";" in email or "--" in email:
        return abort(403, error_msg[Error.INVALID_DATA])

    user = select_all_from_target_table(User, email, User.email)
    if user is not None:
        if bcrypt.check_password_hash(user.user_pw, user_pw):
            return {
                "Authorization": createToken(user.id),
                "id": user.id,
                "name": user.name
            }

    return abort(401, error_msg[Error.INVALID_DATA])


@auth.route("/register", methods=["GET"])
def check_email():
    '''
    # 회원가입 시 중복 아이디 확인용 api
    '''
    email = request.args.get("email")
    if select_all_from_target_table(User, email, User.email):
        return abort(409, error_msg[Error.DUPLICATE_ID])
    return ''


@auth.route("/register", methods=["POST"])
def register():
    '''
    # 회원가입 api
    '''
    email = request.json.get("email")
    raw_password = request.json.get("user_pw")
    user_pw = bcrypt.generate_password_hash(raw_password)
    name = request.json.get("name")

    if select_all_from_target_table(User, email, User.email):
        return abort(409, error_msg[Error.DUPLICATE_ID])

    db.session.add(User(email, user_pw, name))
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 201

'''
# logout => 클라이언트에서 Token 삭제
'''
