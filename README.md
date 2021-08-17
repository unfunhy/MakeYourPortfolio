# Rest API  
URI= "/login"       METHODS=["POST"]    JSON {user_id, user_pw}  
URI= "/register"    METHODS=["POST"]    JSON {user_id, user_pw}  
URI= "/portfolios"  METHODS=["GET"]     PARAMS=search_data  
URI= "/portfolio"   METHODS=["GET"]     PARAMS=id  
URI= "/portfolio"   METHODS=["PATCH"]   PARAMS=id, JSON {target, target_id, ...}  
URI= "/logout"      METHODS=["GET"]  
  
# Schema  
Table User {  
    id,          (int, pk, fk)  
    user_id,     (string)  
    user_pw,     (hash string)  
    introduce    (string)  
    register_date, (date)  
    last_update, (date)  
}

Table Education {  
    edu_id,      (int, pk)  
    id,          (int, fk)  
    school,      (string)  
    major,       (string)  
    state,       (string)  
}  

Table Award {  
    award_id,    (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    desc,        (string)  
}  

Table Project {  
    project_id,  (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    desc,        (string)  
    start,       (date)  
    end,         (date)  
}  

Table Certificate {  
    cert_id,     (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    auth,        (string)  
    acq_date     (date)  
}  


# Flow  
register  
login  
portfolio/loggined_user_id  
  
portfolios  
portfolio/selected_user_id  
  
  
