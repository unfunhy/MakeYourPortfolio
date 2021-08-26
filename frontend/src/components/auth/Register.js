import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import { Card } from "../Card";
import { InputTag } from "../portfolio/PortfolioUtil";

const Register = () => {
  const { user, setUser } = useContext(UserContext);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const name = useRef();

  const [idState, setIdState] = useState(0);
  const [pwState, setPwState] = useState(0);
  const [confirmPwState, setConfirmPwState] = useState(0);

  const history = useHistory();

  const regex_id = /[\w]+@[\w]+\.[\w]+/;
  const regex_invalid = /[^\w!@#$^*+]+/;

  const id_msg = [
    "",
    "사용 가능한 아이디입니다.",
    "이미 존재하는 아이디입니다.",
    "아이디는 이메일 형식이어야 합니다.",
  ];

  const pw_msg = [
    "",
    "사용가능한 비밀번호 입니다.",
    "특수문자는 (!,@,#,$,^,*,+) 만 사용 가능합니다.",
    "비밀번호는 8자 이상 16자 이하여야합니다.",
    "영문 대문자 혹은 소문자를 포함해야 합니다.",
    "숫자를 포함해야 합니다.",
    "특수문자 (!,@,#,$,^,*,+) 중 하나 이상 포함해야 합니다.",
    "비밀번호가 일치하지 않습니다.",
  ];

  useEffect(() => {
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(check_email, 700);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(()=>{
    check_pw();
  }, [pw]);

  useEffect(()=>{
    check_confirm_pw();
  }, [confirmPw]);

  const handleRegister = async () => {
    if (idState !== 1 || pwState !== 1 || confirmPwState !== 0) return;

    try {
      await axios.post(
        '/api/register',
        {
          email: id,
          user_pw: pw,
          name: name.current.value,
        },
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      );
      history.push("/login");
    } catch (e) {
      console.log(e);
      alert(e.response.message);
    }
  };

  const check_email = async () => {
    if (id.length === 0) return;
    if (regex_id.test(id)) {
      try {
        await axios.get('/api/register', { params: { email: id } });
        setIdState(1);
      } catch (e) {
        console.log(e);
        setIdState(2);
      }
    } else {
      setIdState(3);
    }
  };

  const check_pw = () => {
    if (pw.length == 0) setPwState(0);
    else if (regex_invalid.test(pw)) setPwState(2);
    else if (pw.length < 8 || pw.length > 16) setPwState(3);
    else if (!/[A-Za-z]/.test(pw)) setPwState(4);
    else if (!/[0-9]/.test(pw)) setPwState(5);
    else if (!/[!@#$^*+]/.test(pw)) setPwState(6);
    else setPwState(1);
  };

  const check_confirm_pw = () => {
    if (pw !== confirmPw) setConfirmPwState(7);
    else setConfirmPwState(0);
  };

  return (
    <RegisterWrapper>
      <Card login width="400px" height="auto">
        <FlexColumn>
          <RegisterFrame>
            <div>
              <LabelTag>아이디</LabelTag>
              <InputTag value={id} onChange={(e) => setId(e.target.value)} />
              <Ptag state={idState}>{id_msg[idState]}</Ptag>
            </div>
            <div>
              <LabelTag>비밀번호</LabelTag>
              <InputTag
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <Ptag state={pwState}>{pw_msg[pwState]}</Ptag>
            </div>
            <div>
              <LabelTag>비밀번호 확인</LabelTag>
              <InputTag
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
              />
              <Ptag state={confirmPwState}>{pw_msg[confirmPwState]}</Ptag>
            </div>
            <div>
              <LabelTag>이름</LabelTag>
              <InputTag ref={name} />
            </div>
            <BtnTag onClick={handleRegister}>회원가입</BtnTag>
          </RegisterFrame>
        </FlexColumn>
      </Card>
    </RegisterWrapper>
  );
};

export default Register;

const RegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const RegisterFrame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px;
  gap: 25px;
`;

const LabelTag = styled.label`
  font-weight: bold;
`;

const Ptag = styled.p`
  color: ${props=>props.state === 1? "green": "red"};
  margin: 0;
  padding-left: 5px;
  width: 300px;
`;

const BtnTag = styled.button`
  width: auto;
  height: 40px;
  background-color: white;
  border: 2px solid lightgray;
  border-radius: 8px;
  box-shadow: 1px 1px 1px gray;
  font-size: 17px;
  font-weight: bold;
  color: rgb(80, 80, 80);
`;

// 비밀번호 참고자료
// ⑧ 정보통신서비스 제공자등은 개인정보취급자를 대상으로 다음 각 호의 사항을
// 포함하는 비밀번호 작성규칙을 수립하고, 이를 적용․운용하여야 한다.
// 1. 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상 또는 3종류
// 이상을 조합하여 최소 8자리 이상의 길이로 구성
// 2. 연속적인 숫자나 생일, 전화번호 등 추측하기 쉬운 개인정보 및 아이디와 비슷한
// 비밀번호는 사용하지 않는 것을 권고
// - 9 -
// 3. 비밀번호에 유효기간을 설정하여 반기별 1회 이상 변경
// ⑨ 정보통신서비스 제공자등은 처리중인 개인정보가 인터넷 홈페이지, P2P, 공유설정
// 등을 통하여 열람권한이 없는 자에게 공개되거나 외부에 유출되지 않도록 개인정보
// 처리시스템 및 개인정보취급자의 컴퓨터와 모바일 기기에 조치를 취하여야 한다.
// ⑩ 정보통신서비스 제공자등은 개인정보처리시스템에 대한 개인정보취급자의
// 접속이 필요한 시간 동안만 최대 접속시간 제한 등의 조치를 취하여야 한다.
