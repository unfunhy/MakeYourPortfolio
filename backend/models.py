from db_connect import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    email = db.Column(db.String(32), nullable=False, unique=True)
    user_pw = db.Column(db.BINARY(60), nullable=False)
    introduce = db.Column(db.String(128))
    name = db.Column(db.String(32))
    profile = db.Column(db.String(128))
    register_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_update = db.Column(db.DateTime)

    def __init__(self, email, user_pw, name):
        self.email = email
        self.user_pw = user_pw
        self.name = name

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "introduce": self.introduce,
            "profile": self.profile,
            "last_update": self.last_update,
        }

class Education(db.Model):
    __tablename__ = "education"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    school = db.Column(db.String(128), nullable=False)
    major = db.Column(db.String(128), nullable=False)
    state = db.Column(db.SMALLINT, nullable=False)

    def __init__(self, school, major, state):
        self.school = school
        self.major = major
        self.state = state
    
    def to_dict(self):
        return {
            "id": self.id,
            "school": self.school,
            "major": self.major,
            "state": self.state,
        }

class Award(db.Model):
    __tablename__ = "Award"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text(), nullable=False)

    def __init__(self, title, desc):
        self.title = title
        self.desc = desc
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.desc,
        }

class Project(db.Model):
    __tablename__ = "project"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text(), nullable=False)
    start  = db.Column(db.DateTime, nullable=False)
    end  = db.Column(db.DateTime, nullable=False)

    def __init__(self, title, desc, start, end):
        self.title = title
        self.desc = desc
        self.start = start
        self.end = end
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "desc": self.desc,
            "start": self.start,
            "end": self.end,
        }

class Certificate(db.Model):
    __tablename__ = "certificate"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    auth = db.Column(db.String(128), nullable=False)
    acq_date = db.Column(db.DateTime, nullable=False)

    def __init__(self, title, auth, acq_date):
        self.title = title
        self.auth = auth
        self.acq_date = acq_date
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "auth": self.auth,
            "acq_date": self.acq_date,
        }