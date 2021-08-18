import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "./UserContext";
import { Card } from "./Card";

const LoginWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
`;

const Login = () => {
  const history = useHistory();
  const user_id = useRef();
  const user_pw = useRef();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const check_login = async () => {
      try {
        const res = await axios.get("/api/login");
        await setTimeout(() => setUser({ ...res.data }), 0);
        await setTimeout(() => {
          console.log(user);
          if (user.id !== 0) {
            history.push(`/api/portfolio/${user.id}`);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };
    check_login();
  }, []);

  const handleLogin = async () => {
    const data = {
      user_id: user_id.current.value,
      user_pw: user_pw.current.value,
    };

    try {
      const res = await axios.post("/api/login", JSON.stringify(data), {
        headers: {
          "Content-Type": `application/json`,
        },
      });
      console.log(res.data);
      console.log(user);
      setUser({ ...res.data });
      console.log(user);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const handleGoogleLogin = async () => {};

  const handleRegister = () => {
    history.push("/register");
  };

  return (
    <LoginWrapper>
      <Card login width="400px" height="520px">
        <label>아이디</label>
        <input ref={user_id} />
        <label>비밀번호</label>
        <input type="password" ref={user_pw} />
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleGoogleLogin}>구글계정으로 로그인</button>
        <button onClick={handleRegister}>회원가입하기</button>
      </Card>
    </LoginWrapper>
  );
};

export default Login;
