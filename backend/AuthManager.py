import jwt
from flask import request, current_app, abort
from datetime import datetime, timedelta

def createToken(id):
    return jwt.encode(
        {
            "id": id,
            "exp": datetime.utcnow() + timedelta(minutes=1)
        },
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256"
    )

def jwt_required(func):
    def wrapper():
        access_token = request.headers.get("Authorization")
        if access_token is not None:
            try:
                payload = jwt.decode(access_token, current_app.config["JWT_SECRET_KEY"], "HS256")
            except jwt.InvalidTokenError:
                return abort(401, "INVALID_TOKEN")
            except jwt.ExpiredSignatrueError:
                return abort(401, "EXPIRED_TOKEN")

            func(payload.get("id"))

        else:
            return abort(401, "UNAUTHORIZED_USER")

    return wrapper

# 시간 남을 시 access token, refresh token 구현
# 참고자료: https://tansfil.tistory.com/59