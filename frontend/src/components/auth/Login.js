import React, { useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import { baseURL } from "../../Config";
import UserContext from "../UserContext";
import { Card } from "../Card";
import { InputTag } from "../portfolio/PortfolioUtil";

const Login = () => {
  const history = useHistory();
  const emailRef = useRef();
  const userPwRef = useRef();
  const { user, setUser } = useContext(UserContext);

  //전역변수 user.id가 0이 아니면 내 포트폴리오로 이동
  useEffect(() => {
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, [user]);

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const user_pw = userPwRef.current.value;

    if (email.length === 0 || user_pw.length === 0) {
      alert("아이디와 비밀번호를 확인해주세요.");
      return;
    }

    const data = {
      email,
      user_pw,
    };

    try {
      const res = await axios.post(`${baseURL}/api/login`, JSON.stringify(data), {
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

  const handleKeyDown = (e) => {
    if (e.keyCode == 13) handleLogin();
  };

  const handleGoogleLogin = async () => {};

  const handleRegister = () => {
    history.push("/register");
  };

  return (
    <LoginWrapper>
      <Card login width="400px" height="auto">
        <FlexColumn>
          <LoginFrame>
            <div>
            <LabelTag>아이디</LabelTag>
            <InputTag ref={emailRef} onKeyDown={handleKeyDown} />
            </div>
            <div>
            <LabelTag>비밀번호</LabelTag>
            <InputTag
              type="password"
              ref={userPwRef}
              onKeyDown={handleKeyDown}
            />
            </div>
            <BtnTag onClick={handleLogin}>
              로그인
            </BtnTag>
            <div>
              <BtnTag onClick={handleRegister}>
                회원가입하기
              </BtnTag>
            </div>
          </LoginFrame>
        </FlexColumn>
      </Card>
    </LoginWrapper>
  );
};

export default Login;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const LoginFrame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px;
  gap: 25px;
`;

const LabelTag = styled.label`
  font-weight: bold;
`;

const BtnTag = styled.button`
  width: 300px;
  height: 40px;
  background-color: white;
  border: 2px solid lightgray;
  border-radius: 8px;
  box-shadow: 1px 1px 1px gray;
  font-size: 17px;
  font-weight: bold;
  color: rgb(80,80,80);
`;
