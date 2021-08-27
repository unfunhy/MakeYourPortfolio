import os
import base64
from flask import request, Blueprint, jsonify, abort, current_app
from werkzeug.utils import secure_filename
import dateutil.parser as dt
import time
import pytz

from models import User, Education, Award, Project, Certificate
from db_connect import db
from AuthManager import jwt_required
from QueryManager import select_all_from_target_table
from ErrorManager import Error, error_msg


portfolio = Blueprint('portfolio', __name__, url_prefix="/api")

def select_all_from_user_like(search):
    if len(search) < 2: 
        return select_all_from_target_table(User)
    return User.query.filter(User.name.like("%{}%".format(search))).all()

@portfolio.route("/portfolios", methods=["GET"])
def get_portfolio_list():
    '''
    # network page API
    '''
    search = request.args.get("search")
    users = select_all_from_user_like(search)
    func = User.to_dict
    return jsonify(list(map(func, users)))

@portfolio.route("/portfolios/profile", methods=["GET"])
def get_portfolio_profile_list():
    '''
    # network page API for profile img
    '''
    search = request.args.get("search")
    users = select_all_from_user_like(search)
    data = []

    for user in users:
        filename = user.profile
        if filename is None:
            data.append("")
            continue

        dir = current_app.config["MYSQL_FILEDATA_DIR"]
        extension = filename.split('.')[-1]

        with open(os.path.join(dir, filename), 'rb') as img:
            byte_content = img.read()
            base64_bytes = base64.b64encode(byte_content)
            base64_string = base64_bytes.decode("utf-8")

            imgURL = "data:image/{};base64, {}".format(extension, base64_string)
            data.append(imgURL)

    return jsonify(data)

def datetime_to_timestamp(data_list, keys):
    for data in data_list:
        for key in keys:
            data[key] = time.mktime(data[key].timetuple()) * 1000



def get_target_data(id, target_obj):
    func = target_obj.to_dict
    column = target_obj.user_id
    lst = select_all_from_target_table(target_obj, column, id)

    ret = list(map(func, lst))
    if target_obj == Project:
        datetime_to_timestamp(ret, ["start", "end"])
    elif target_obj == Certificate:
        datetime_to_timestamp(ret, ["acq_date"])

    return ret

# user portfolio page API
@portfolio.route("/portfolio", methods=["GET"])
@jwt_required
def get_portfolio(_id):
    id = request.args.get("id")
    data = {}

    data["user"] = select_all_from_target_table(User, User.id, id)[0].to_dict()
    data["education"] = get_target_data(id, Education)
    data["award"] = get_target_data(id, Award)
    data["project"] = get_target_data(id, Project)
    data["certificate"] = get_target_data(id, Certificate)

    return data

# portfolio user update API
# introduce만 관리, profile은 별도의 api
@portfolio.route("/portfolio/user", methods=["PATCH"])
@jwt_required
def update_portfolio_user(id):
    data = request.json.get("user")

    if data is None:
        return abort(400)

    target = select_all_from_target_table(User, User.id, id)[0]
    target.update(data)

    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 204

@portfolio.route("/portfolio/profile", methods=["GET"])
@jwt_required
def get_portfolio_profile(_id):
    id = request.args.get("id")
    data = select_all_from_target_table(User, User.id, id)[0]

    filename = data.profile
    if filename is None:
        return abort(400)

    dir = current_app.config["MYSQL_FILEDATA_DIR"]
    extension = filename.split('.')[-1]

    #참고자료 - https://stackoverflow.com/questions/37225035/serialize-in-json-a-base64-encoded-data
    try:
        with open(os.path.join(dir, filename), 'rb') as img:
            byte_content = img.read()
            base64_bytes = base64.b64encode(byte_content)
            base64_string = base64_bytes.decode("utf-8")

            imgURL = "data:image/{};base64, {}".format(extension, base64_string)
            ret = {"profile": imgURL}
    except:
        return abort(400)

    return ret


@portfolio.route("/portfolio/profile", methods=["POST"])
@jwt_required
def update_portfolio_profile(id):
    file = request.files.get("file")

    if file is None or file.filename == "":
        return abort(400)

    dir = current_app.config["MYSQL_FILEDATA_DIR"]
    os.makedirs(dir, exist_ok=True)
    filename = "{}.{}".format(id, secure_filename(file.filename.split('.')[-1]))

    file.save(os.path.join(dir, filename))

    target = select_all_from_target_table(User, User.id, id)
    target[0].profile = filename

    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 204

def convert_datetime_format(data_list, keys):
    for data in data_list:
        for key in keys:
            data[key] = dt.parse(data[key]).astimezone(tz=pytz.timezone("Asia/Seoul"))

# portfolio update
def update_portfolio(target_obj, target_str, user_id):
    data_list = request.json.get(target_str)
    id_list = []

    if target_obj == Project:
        convert_datetime_format(data_list, ["start", "end"])
    elif target_obj == Certificate:
        convert_datetime_format(data_list, ["acq_date"])
    if data_list is None:
        return abort(400, "변경 데이터가 없습니다.")

    for data in data_list:
        curData = select_all_from_target_table(target_obj, target_obj.id, data.get("id"))
        if len(curData) != 0:
            curData = curData[0]
            curData.update(data)
        else:
            data["user_id"] = user_id
            curData = target_obj(data)

            db.session.add(curData)

        try:
            db.session.commit() 
        except:
            db.session.rollback()
            return abort(500, error_msg[Error.INTERNAL_DB_ERROR])
        
        id_list.append(curData.id)

    return jsonify(id_list)

# portfolio education update API
@portfolio.route("/portfolio/education", methods=["PATCH"])
@jwt_required
def update_portfolio_education(id):
    return update_portfolio(Education, "education", id)

# portfolio award update API
@portfolio.route("/portfolio/award", methods=["PATCH"])
@jwt_required
def update_portfolio_award(id):
    return update_portfolio(Award, "award", id)

# portfolio project update API
@portfolio.route("/portfolio/project", methods=["PATCH"])
@jwt_required
def update_portfolio_project(id):
    return update_portfolio(Project, "project", id)

# portfolio cert update API
@portfolio.route("/portfolio/certificate", methods=["PATCH"])
@jwt_required
def update_portfolio_cert(id):
    return update_portfolio(Certificate, "certificate", id)


# portfolio delete
def delete_portfolio(target_obj, user_id):
    data_id = request.json.get("id")

    if data_id is None:
        return abort(400, "변경 데이터가 없습니다.")

    curData = select_all_from_target_table(target_obj, target_obj.id, data_id)

    if len(curData) == 0:
        return abort(400, "요청 데이터가 없습니다.")

    curData = curData[0]
    if (user_id != curData.user_id):
        return abort(400, "올바르지 않은 요청입니다.")

    db.session.delete(curData)

    try:
        db.session.commit() 
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return ''

# portfolio education update API
@portfolio.route("/portfolio/education", methods=["DELETE"])
@jwt_required
def delete_portfolio_education(id):
    return delete_portfolio(Education, id)

# portfolio award update API
@portfolio.route("/portfolio/award", methods=["DELETE"])
@jwt_required
def delete_portfolio_award(id):
    return delete_portfolio(Award, id)

# portfolio project update API
@portfolio.route("/portfolio/project", methods=["DELETE"])
@jwt_required
def delete_portfolio_project(id):
    return delete_portfolio(Project, id)

# portfolio cert update API
@portfolio.route("/portfolio/certificate", methods=["DELETE"])
@jwt_required
def delete_portfolio_cert(id):
    return delete_portfolio(Certificate, id)