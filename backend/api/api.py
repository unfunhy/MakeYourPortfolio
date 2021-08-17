from flask import json, request, jsonify, session, Blueprint
from flask.helpers import make_response

from models import User, Education, Award, Project, Certificate
from db_connect import db

portfolio = Blueprint('portfolio', __name__, url_prefix="/api")

@portfolio.route("/portfolios", methods=["GET"])
def get_portfolio_list(search_data):
    user_format = {
        "id": 0,
        "user_id": "",
        "introduce": "",
        "last_update": ""
    }
    ret = []

    for user in db.session.query(User).filter(User.last_update != None).all():
        user_format["id"] = user.id
        user_format["user_id"] = user.user_id
        user_format["introduce"] = user.introduce
        user_format["last_update"] = user.last_update
        ret.append(user_format)

    return make_response(jsonify(ret), state=200)


@portfolio.route("/portfolio", methods=["GET"])
def get_portfolio(id):
    portfolio_format = {
        "user_id": "",
        "introduce": "",
        "last_update": "",
        "educations": [],
        "awards": [],
        "projects": [],
        "certifications": []
    }

    education_format = {
        "edu_id": 0,
        "school": "",
        "major": "",
        "state": ""
    }

    award_format = {
        "award_id": 0,
        "title": "",
        "desc": ""
    }

    project_format = {
        "project_id": 0,
        "title": "",
        "desc": "",
        "start": "",
        "end": ""
    }

    certificate_format = {
        "cert_id": 0,
        "title": "",
        "auth": "",
        "acq_data": ""
    }

    ret = portfolio_format

    try:
        user = db.session.query(User).filter(User.id == id).first()
        ret["user_id"] = user.user_id
        ret["introduce"] = user.introduce
        ret["last_update"] = user.last_update

        for edu in db.session.query(Education).all():
            education_format["edu_id"] = edu.edu_id
            education_format["school"] = edu.school
            education_format["major"] = edu.major
            education_format["state"] = edu.state
            ret[edu.id]["educations"].append(education_format)

        for award in db.session.query(Award).all():
            award_format["award_id"] = award.award_id
            award_format["title"] = award.title
            award_format["desc"] = award.desc
            ret[award.id]["awards"].append(award_format)

        for pj in db.session.query(Project).all():
            project_format["project_id"] = pj.project_id
            project_format["title"] = pj.title
            project_format["desc"] = pj.desc
            project_format["start"] = pj.start
            project_format["end"] = pj.end
            ret[pj.id]["projects"].append(project_format)

        for cert in db.session.query(Certificate).all():
            certificate_format["cert_id"] = cert.cert_id
            certificate_format["title"] = cert.title
            certificate_format["auth"] = cert.auth
            certificate_format["acq_date"] = cert.acq_date
            ret[cert.id]["certifications"].append(certificate_format)

    except KeyError as e:
        return make_response({
            "message": ""
        }, status=500)
    
    return make_response(jsonify(ret), status=200)

@portfolio.route("/portfolio", methods=["PATCH"])
def update_portfolio(id):
    data = request.get_json()
    if data.get("introduce") is not None:
        user = db.session.query(User).filter(User.id == id).first()
        user.introduce = data.get("introduce")
    elif data.get("profile") is not None:
        user = db.session.query(User).filter(User.id == id).first()
        user.profile = data.get("profile")
    elif data.get("education") is not None:
        for item in data.get("education"):
            exist = db.session.query(Education).filter(Education.edu_id == item.id).first()
            if exist is not None:
                exist.school = item.school
                exist.major = item.major
                exist.state = item.state
            else:
                db.session.add(Education(item.school, item.major, item.state))
    elif data.get("award") is not None:
        for item in data.get("award"):
            exist = db.session.query(Award).filter(Award.award_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.desc = item.desc
            else:
                db.session.add(Award(item.title, item.desc))
    elif data.get("project") is not None:
        for item in data.get("project"):
            exist = db.session.query(Project).filter(Project.project_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.desc = item.desc
                exist.start = item.start
                exist.end = item.end
            else:
                db.session.add(Project(item.title, item.desc, item.start, item.end))
    elif data.get("certificate") is not None:
        for item in data.get("award"):
            exist = db.session.query(Certificate).filter(Certificate.cert_id == item.id).first()
            if exist is not None:
                exist.title = item.title
                exist.auth = item.auth
                exist.acq_date = item.acq_date
            else:
                db.session.add(Certificate(item.title, item.auth, item.acq_date))
    else:
        return make_response(jsonify({
            "message": "변경 데이터가 없습니다."
        }), state=400)
    
    db.session.commit()

    return make_response(jsonify({
        "result": "success"
    }), state=204)

