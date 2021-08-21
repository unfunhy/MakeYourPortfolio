# Rest API  
URI= "/login"       METHODS=["GET"]     JWT=>id / return id, name  
URI= "/login"       METHODS=["POST"]    JSON {user_id, user_pw} / return {JWT, id, name}  
URI= "/register"    METHODS=["POST"]    JSON {user_id, user_pw}  
URI= "/portfolios"  METHODS=["GET"]     PARAMS=search_data / return data  
URI= "/portfolio"   METHODS=["GET"]     JWT=>id / return data  
URI= "/portfolio"   METHODS=["PATCH"]   JWT=>id, JSON {target, target_id, ...}  
~~URI= "/logout"      METHODS=["GET"]     Deleted ...~~  
  
# Schema  

```
Table User {  
    id,          (int, pk, fk)  
    user_id,     (string)  
    user_pw,     (hash string)  
    name,        (string)  
    introduce    (string)  
    profile      (string)
    register_date, (date)  
    last_update, (date)  
}
```

```
Table Education {  
    edu_id,      (int, pk)  
    id,          (int, fk)  
    school,      (string)  
    major,       (string)  
    state,       (string)  
}  
```

```
Table Award {  
    award_id,    (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    desc,        (string)  
}  
```

```
Table Project {  
    project_id,  (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    desc,        (string)  
    start,       (date)  
    end,         (date)  
}  
```

```
Table Certificate {  
    cert_id,     (int, pk)  
    id,          (int, fk)  
    title,       (string)  
    auth,        (string)  
    acq_date     (date)  
}  
```


# Flow  
register  
login  
portfolio/loggined_user_id  
  
portfolios  
portfolio/selected_user_id  
  
  

# 구현 필요한 부분
1. portfolio 페이지
2. file input api, schema 변경
2. network 페이지