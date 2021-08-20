import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "./UserContext";
import { Card } from "./Card";
import * as Auth from "./auth/Auth";

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
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, []);

  useEffect(() => {
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, [user]);

  const handleLogin = async () => {
    const data = {
      user_id: user_id.current.value,
      user_pw: user_pw.current.value,
    };

    try {
      const res = await axios.post("api/login", JSON.stringify(data), {
        headers: {
          "Content-Type": `application/json`,
        },
      });
      localStorage.setItem("access-token", res.data.Authorization);
      setUser({ id: res.data.id, name: res.data.name });
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
