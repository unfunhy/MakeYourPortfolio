import React, { useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import styled from 'styled-components';

import { Card } from "./Card";

const LoginWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
`;

const Login = () => {
  const user_id = useRef();
  const user_pw = useRef();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const check_login = async () => {
      const res = await axios.get("/api/login");
      setResponse(res.data);
    }
    check_login();
  }, []);

  const handleLogin = async () => {
    const data = {
      "user_id": user_id.current.value,
      "user_pw": user_pw.current.value
    };

    console.log(response);

    try {
      const res = await axios.post('/api/login', JSON.stringify(data), {
        headers: {
          "Content-Type": `application/json`,
        },
      });
      setResponse(res.data);
      console.log(res)
    } catch(e) {
      alert(e.response.data.message)
    }
  }

  const handleGoogleLogin = async () => {

  }

  const handleRegister = () => {

  }

  return (
    <LoginWrapper>
      <Card login width="400px" height="520px" >
        <label>아이디</label>
        <input ref={user_id} />
        <label>비밀번호</label>
        <input ref={user_pw} />
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleGoogleLogin}>구글계정으로 로그인</button>
        <button onClick={handleRegister}>회원가입하기</button>
      </Card>
    </LoginWrapper>
  );
};

export default Login;
