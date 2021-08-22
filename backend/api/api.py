from os import abort
from flask import request, Blueprint

from models import User, Education, Award, Project, Certificate
from db_connect import db
from AuthManager import jwt_required
from QueryManager import select_all_from_target_table
from ErrorManager import Error, error_msg


portfolio = Blueprint('portfolio', __name__, url_prefix="/api")


@portfolio.route("/portfolios", methods=["GET"])
def get_portfolio_list():
    '''
    # network page API
    '''
    
    search = request.args.get("search")
    
    users = User.query.filter(User.last_update != None and User.name.like("%{}%".format(search))).all()
    func = User.to_dict
    data = list(map(func, users))

    return data

# user portfolio page API
@portfolio.route("/portfolio", methods=["GET"])
@jwt_required
def get_portfolio(id):
    data = {}

    #user = User.query.filter(User.id == id).first()
    user = select_all_from_target_table(User, id, User.id)
    data["user"] = user.to_dict()

    func = Education.to_dict
    #edu_list = Education.query.filter(Education.id == id).all()
    cur_list = select_all_from_target_table(Education, id, Education.user_id)
    data["educations"] = list(map(func, cur_list))

    func = Award.to_dict
    cur_list = select_all_from_target_table(Award, id, Award.user_id)
    data["awards"] = list(map(func, cur_list))

    func = Project.to_dict
    cur_list = select_all_from_target_table(Project, id, Project.user_id)
    data["projects"] = list(map(func, cur_list))

    func = Certificate.to_dict
    cur_list = select_all_from_target_table(Certificate, id, Certificate.user_id)
    data["certificates"] = list(map(func, cur_list))

    return data

# user portfolio update API
@portfolio.route("/portfolio", methods=["PATCH"])
@jwt_required
def update_portfolio(id):
    #id = request.args.get("id")
    # 데이터를 받아서 어떤 데이터가 갱신or생성되었는지 확인
    data = request.get_json()
    if data.get("introduce") is not None:
        #user = User.query.filter(User.id == id).first()
        user = select_all_from_target_table(User, User.id, id)
        user.introduce = data.get("introduce")
    elif data.get("profile") is not None:
        user = User.query.filter(User.id == id).first()
        user.profile = data.get("profile")

    # 리스트 형태로 받아 순회하면서
    # id값이 이미 db에 있으면 갱신 없으면 생성
    elif data.get("education") is not None:
        for item in data.get("education"):
            exist = Education.query.filter(Education.id == item.id).first()
            if exist is not None:
                exist.school = item.school
                exist.major = item.major
                exist.state = item.state
            else:
                db.session.add(Education(item.school, item.major, item.state))
    elif data.get("award") is not None:
        for item in data.get("award"):
            exist = Award.query.filter(Award.award_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.desc = item.desc
            else:
                db.session.add(Award(item.title, item.desc))
    elif data.get("project") is not None:
        for item in data.get("project"):
            exist = Project.query.filter(Project.project_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.desc = item.desc
                exist.start = item.start
                exist.end = item.end
            else:
                db.session.add(
                    Project(item.title, item.desc, item.start, item.end))
    elif data.get("certificate") is not None:
        for item in data.get("award"):
            exist = Certificate.query.filter(
                Certificate.cert_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.auth = item.auth
                exist.acq_date = item.acq_date
            else:
                db.session.add(Certificate(
                    item.title, item.auth, item.acq_date))
    else:
        return abort(400, "변경 데이터가 없습니다.")

    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 204
