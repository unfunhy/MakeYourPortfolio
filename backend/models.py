from db_connect import db
from datetime import datetime

class User(db.Model):
    '''
    # 업데이트 가능 항목: introduce, profile
    # 특이사항: profile은 별도 관리
    # 다른 테이블과 다르게 create와 update의 대상이 되는 column이 다르므로
    # 별도의 init함수 작성
    '''
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    email = db.Column(db.String(32), nullable=False, unique=True)
    user_pw = db.Column(db.BINARY(60), nullable=False)
    introduce = db.Column(db.String(128))
    name = db.Column(db.String(32))
    profile = db.Column(db.String(128))
    register_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_update = db.Column(db.DateTime)

    def __set_column__(self, key, val):
        if key == "introduce":
            self.introduce = val
        elif key == "profile":
            self.profile = val

    def update(self, data):
        for key in data.keys():
            self.__set_column__(key, data.get(key))

    def __init__(self, data):
        self.email = data.get("email")
        self.user_pw = data.get("user_pw")
        self.name = data.get("name")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "introduce": self.introduce,
            "profile": self.profile,
        }


class Education(db.Model):
    __tablename__ = "education"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    school = db.Column(db.String(128), nullable=False)
    major = db.Column(db.String(128), nullable=False)
    state = db.Column(db.SMALLINT, nullable=False)

    def __set_column__(self, key, val):
        if key == "school":
            self.school = val
        elif key == "major":
            self.major = val
        elif key == "state":
            self.state = val
        elif key == "user_id":
            self.user_id = val

    def update(self, data):
        for key in data.keys():
            self.__set_column__(key, data.get(key))

    def __init__(self, data):
        self.update(data)
    
    def to_dict(self):
        return {
            "id": self.id,
            "school": self.school,
            "major": self.major,
            "state": self.state,
        }

class Award(db.Model):
    __tablename__ = "award"
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    title = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text(), nullable=False)

    def __set_column__(self, key, val):
        if key == "title":
            self.title = val
        elif key == "desc":
            self.desc = val
        elif key == "user_id":
            self.user_id = val

    def update(self, data):
        for key in data.keys():
            self.__set_column__(key, data.get(key))

    def __init__(self, data):
        self.update(data)
    
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
    start  = db.Column(db.Date, nullable=False)
    end  = db.Column(db.Date, nullable=False)

    def __set_column__(self, key, val):
        if key == "title":
            self.title = val
        elif key == "desc":
            self.desc = val
        elif key == "start":
            self.start = val
        elif key == "end":
            self.end = val
        elif key == "user_id":
            self.user_id = val

    def update(self, data):
        for key in data.keys():
            self.__set_column__(key, data.get(key))

    def __init__(self, data):
        self.update(data)
    
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
    acq_date = db.Column(db.Date, nullable=False)

    def __set_column__(self, key, val):
        if key == "title":
            self.title = val
        elif key == "auth":
            self.auth = val
        elif key == "acq_date":
            self.acq_date = val
        elif key == "user_id":
            self.user_id = val

    def update(self, data):
        for key in data.keys():
            self.__set_column__(key, data.get(key))

    def __init__(self, data):
        self.update(data)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "auth": self.auth,
            "acq_date": self.acq_date,
        }