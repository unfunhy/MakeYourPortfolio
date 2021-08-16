from db_connect import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.String(32), nullable=False, unique=True)
    user_pw = db.Column(db.String(128), nullable=False)
    register_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_update = db.Column(db.DateTime)

    def __init__(self, user_id, user_pw):
        self.user_id = user_id
        self.user_pw = user_pw

class Education(db.Model):
    __tablename__ = "education"
    edu_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    id = db.Column(db.Integer, db.ForeignKey("user.id"))
    school = db.Column(db.String(128), nullable=False)
    major = db.Column(db.String(128), nullable=False)

    def __init__(self, school, major):
        self.school = school
        self.major = major

class Award(db.Model):
    __tablename__ = "Award"
    award_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text(), nullable=False)

    def __init__(self, title, desc):
        self.title = title
        self.desc = desc

class Project(db.Model):
    __tablename__ = "project"
    project_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text(), nullable=False)
    start  = db.Column(db.DateTime, nullable=False)
    end  = db.Column(db.DateTime, nullable=False)

    def __init__(self, title, desc, start, end):
        self.title = title
        self.desc = desc
        self.start = start
        self.end = end

class Certificate(db.Model):
    __tablename__ = "certificate"
    cert_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    auth = db.Column(db.String(128), nullable=False)
    acq_date = db.Column(db.DateTime, nullable=False)

    def __init__(self, title, auth, acq_date):
        self.title = title
        self.auth = auth
        self.acq_date = acq_date