from enum import IntEnum

class Error(IntEnum):
    INVALID_DATA = 0
    DUPLICATE_ID = 1
    INTERNAL_DB_ERROR = 2


error_msg = [
    "올바르지 않은 아이디 혹은 비밀번호입니다.",
    "이미 존재하는 아이디 입니다.",
    "내부 서버 오류입니다. 오류가 지속될 시 문의 바랍니다."
]