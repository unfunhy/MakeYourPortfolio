import React, { useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import { Card } from "../Card";

const Login = () => {
  const history = useHistory();
  const email = useRef();
  const user_pw = useRef();
  const { user, setUser } = useContext(UserContext);

  //전역변수 user.id가 0이 아니면 내 포트폴리오로 이동
  useEffect(() => {
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, [user]);

  const handleLogin = async () => {
    const data = {
      email: email.current.value,
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
      alert(e.response.data);
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
        <input ref={email} />
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

const LoginWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
`;
