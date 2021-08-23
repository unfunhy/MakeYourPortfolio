import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import * as Auth from "./Auth";
import { Card } from "../Card";

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

const Register = () => {
  const { user, setUser } = useContext(UserContext);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const name = useRef();

  const [id_state, set_id_state] = useState(0);

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
  ];

  useEffect(() => {
    if (user.id !== 0) history.push(`/portfolio/${user.id}`);
  }, []);

  useEffect(() => {
    var timer = setTimeout(check_email, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handleRegister = async () => {
    if (id_state != 1 || check_pw() != 1) return;

    try {
      const res = await axios.post(
        "/api/register",
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
    if (id.length == 0) return;
    if (regex_id.test(id)) {
      try {
        await axios.get("/api/register", { params: { email: id } });
        set_id_state(1);
      } catch (e) {
        console.log(e);
        set_id_state(2);
      }
    } else {
      set_id_state(3);
    }
  };

  const check_pw = () => {
    if (pw.length == 0) return 0;
    if (regex_invalid.test(pw)) return 2;
    else if (pw.length < 8 || pw.length > 16) return 3;
    else if (!/[A-Za-z]/.test(pw)) return 4;
    else if (!/[0-9]/.test(pw)) return 5;
    else if (!/[!@#$^*+]/.test(pw)) return 6;
    else return 1;
  };

  const check_confirm_pw = () => {
    if (pw !== confirmPw) return false;
    else return true;
  };

  return (
    <RegisterWrapper>
      <Card login width="400px" height="520px">
        <label>아이디</label>
        <input value={id} onChange={(e) => setId(e.target.value)} />
        <p>{id_msg[id_state]}</p>
        <label>비밀번호</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <p>{pw_msg[check_pw()]}</p>
        <label>비밀번호 확인</label>
        <input
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
        />
        {!check_confirm_pw() && <p>비밀번호가 일치하지 않습니다.</p>}
        <label>이름</label>
        <input
          ref={name}
        />
        <button onClick={handleRegister}>회원가입</button>
      </Card>
    </RegisterWrapper>
  );
};

export default Register;

const RegisterWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
`;