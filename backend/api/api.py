from os import abort
from flask import request, Blueprint, jsonify

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

    return jsonify(data)

def get_target_data(id, target_obj):
    func = target_obj.to_dict
    lst = select_all_from_target_table(target_obj, target_obj.user_id, id)
    return list(map(func, lst))

# user portfolio page API
@portfolio.route("/portfolio", methods=["GET"])
@jwt_required
def get_portfolio(id):
    data = {}

    # user = select_all_from_target_table(User, User.id, id)
    # data["user"] = user.to_dict()

    data["user"] = get_target_data(id, User)
    data["education"] = get_target_data(id, Education)
    data["award"] = get_target_data(id, Award)
    data["project"] = get_target_data(id, Project)
    data["certificate"] = get_target_data(id, Certificate)

    return data

# portfolio update
def update_portfolio(target_obj, target_str):
    data_list = request.json.get(target_str)

    if data_list is None:
        abort(400, "변경 데이터가 없습니다.")

    for data in data_list:
        exist = select_all_from_target_table(target_obj, target_obj.id, data.id)
        if exist is not None:
            exist.update(data)
        else:
            db.session.add(target_obj(data))

    try:
        db.session.commit()
    except:
        db.session.rollback()
        return abort(500, error_msg[Error.INTERNAL_DB_ERROR])

    return '', 204

# portfolio user update API
@portfolio.route("/portfolio/user", methods=["PATCH"])
@jwt_required
def update_portfolio_user(id):
    return update_portfolio(User, "user")

# portfolio education update API
@portfolio.route("/portfolio/education", methods=["PATCH"])
@jwt_required
def update_portfolio_education(id):
    return update_portfolio(Education, "education")

# portfolio award update API
@portfolio.route("/portfolio/award", methods=["PATCH"])
@jwt_required
def update_portfolio_award(id):
    return update_portfolio(Award, "award")

# portfolio project update API
@portfolio.route("/portfolio/project", methods=["PATCH"])
@jwt_required
def update_portfolio_project(id):
    return update_portfolio(Project, "project")

# portfolio cert update API
@portfolio.route("/portfolio/certificate", methods=["PATCH"])
@jwt_required
def update_portfolio_cert(id):
    return update_portfolio(Certificate, "certificate")