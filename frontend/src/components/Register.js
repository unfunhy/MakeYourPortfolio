import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "./UserContext";
import { Card } from "./Card";

const RegisterWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
`;

const Register = () => {
  const { user, setUser } = useContext(UserContext);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

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
    const check_login = async () => {
      try {
        const res = await axios.get("/api/login");
        setUser({ ...res.data });
        if (user.id !== 0) {
          history.push(`/portfolio/${user.id}`);
        }
      } catch (e) {
        console.log(e);
      }
    };
    check_login();
  }, []);

  useEffect(() => {
    var timer = setTimeout(check_id, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    check_pw();
  }, [pw]);

  useEffect(() => {
    check_confirm_pw();
  }, [confirmPw]);

  const handleRegister = async () => {
    if (id_state != 1 || check_pw() != 1) return;

    try {
      const res = await axios.post(
        "/api/register",
        {
          user_id: id,
          user_pw: pw,
        },
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      );
      await setTimeout(() => history.push("/login"), 0);
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const check_id = async () => {
    if (id.length == 0) return;
    if (regex_id.test(id)) {
      try {
        await axios.get("/api/register", { params: { user_id: id } });
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
        <button onClick={handleRegister}>회원가입</button>
      </Card>
    </RegisterWrapper>
  );
};

export default Register;
