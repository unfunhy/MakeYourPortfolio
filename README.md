# Rest API  
URI= "/login"       METHODS=["GET"]     JWT=>id / return id, name  
URI= "/login"       METHODS=["POST"]    JSON {user_id, user_pw} / return {JWT, id, name}  
URI= "/register"    METHODS=["POST"]    JSON {user_id, user_pw}  
URI= "/portfolios"  METHODS=["GET"]     PARAMS=search_data / return data  
URI= "/portfolio"   METHODS=["GET"]     JWT=>id / return data  
URI= "/portfolio/user"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/profile"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/education"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/award"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/project"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/certificate"   METHODS=["PATCH"]   JWT=>id / return JSON {target, target_id, ...}  
URI= "/portfolio/education"   METHODS=["DELETE"]   JWT=>id  
URI= "/portfolio/award"   METHODS=["DELETE"]   JWT=>id  
URI= "/portfolio/project"   METHODS=["DELETE"]   JWT=>id  
URI= "/portfolio/certificate"   METHODS=["DELETE"]   JWT=>id  
URI= "/img"   METHODS=["GET"]   PARAMS=imgSrc    
  
  
# Schema  

```
Table user {  
    id,          (int, pk, fk)  
    email,       (varchar(32))  
    user_pw,     (binary(60))  
    name,        (varchar(16))  
    introduce    (varchar(128))  
    profile      (varchar(128))
    register_date, (datetime)  
    last_update, (datetime)  
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


# Flow  
register  
login  
portfolio/loggined_user_id  
  
portfolios  
portfolio/selected_user_id  
  
  
