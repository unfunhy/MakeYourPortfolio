# 프로젝트 설명
PortfolioIn은 상용 서비스인 LinkedIn처럼 개인이 포트폴리오를 작성하고 다른 이들과 공유할 수 있는 서비스입니다. 회원가입, 로그인, 개인 포트폴리오 작성, 다른 유저의 포트폴리오를 모아서 보여주는 네트워크, 상세 포트폴리오 페이지 등으로 구성되어 있으며, LinkedIn에서 사용되는 다른 사용자와의 상호 작용이나, 업종이나 관심 분야에 따라 사용자를 추천해주는 시스템은 앞으로 개선해나가야 할 기능입니다.
  
  
# 기술 스택
### Backend 
- Python, Flask, Sqlalchemy, MySQL  
### Frontend  
- Javascript, React, Styled component  
### 통신 및 인증 
- Axios, JWT
  
  
# Rest API  
##### get_user_info
URI = "/login"    
METHODS = ["GET"]  
headers = { Authorization }  
response = { id, name }
desc = 토큰으로 유저 id, name 확인용 api
##### login
URI = "/login"  
METHODS = ["POST"]  
data = { email, user_pw }  
response = { Authorization, id, name}  
desc = 유저 로그인 api
##### check_email
URI = "/register"  
METHODS = ["GET"]  
parmas = { email }   
##### register
URI = "/register"  
METHODS = ["POST"]  
data = {user_id, user_pw}  
##### get_portfolio_list
URI = "/portfolios"  
METHODS = ["GET"]  
params = { search }  
response = { { id, introduce, name, profile }, ... }
desc = 네트워크 페이지 유저 정보 api
##### get_portfolio
URI = "/portfolio"   
METHODS = ["GET"]  
headers, params = { Authorization, id } 
response = { user, education, award, project, certificate }  
desc = 특정 유저의 상세 포트폴리오 페이지 열람 api
##### update_portfolio
URI= "/portfolio/user"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
URI= "/portfolio/profile"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
URI= "/portfolio/education"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
URI= "/portfolio/award"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
URI= "/portfolio/project"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
URI= "/portfolio/certificate"   METHODS=["PATCH"]   headers={ Authorization }  response = {target, target_id, ...}  
##### delete_information
URI= "/portfolio/education"   METHODS=["DELETE"]   headers={ Authorization }  
URI= "/portfolio/award"   METHODS=["DELETE"]   headers={ Authorization }  
URI= "/portfolio/project"   METHODS=["DELETE"]   headers={ Authorization }  
URI= "/portfolio/certificate"   METHODS=["DELETE"]   headers={ Authorization }  
##### get_static_img
URI= "/img"   METHODS=["GET"]   PARAMS=imgSrc    
  
  
# DB Schema  
```
Table user {  
    id,          (int, pk, fk)  
    email,       (varchar(32))  
    user_pw,     (binary(60))  
    name,        (varchar(16))  
    introduce    (varchar(128))  
    profile      (varchar(128))
    register_date, (datetime)  
}
```

```
Table education {  
    id,          (int, pk)  
    user_id,     (int, fk)  
    school,      (varchar(128))  
    major,       (varchar(128))  
    state,       (char(1))  
}  
Table education_state{
    id,          (int, pk)
    state        (varchar(16))
}
```

```
Table award {  
    id,          (int, pk)  
    user_id,     (int, fk)  
    title,       (varchar(128))  
    desc,        (text)  
}  
```

```
Table Project {  
    id,          (int, pk)  
    user_id,     (int, fk)  
    title,       (varchar(128))  
    desc,        (text)  
    start,       (date)  
    end,         (date)  
}  
```

```
Table Certificate {  
    id,          (int, pk)  
    user_id,     (int, fk)  
    title,       (varchar(128))  
    auth,        (varchar(128))  
    acq_date     (date)  
}  
```
