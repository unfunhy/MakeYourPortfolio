import React, {useContext} from "react";
import {Link, useHistory} from 'react-router-dom';
import styled from "styled-components";
import { removeToken } from "./auth/Auth";

import UserContext from "./UserContext";

const CustomLink = (props) => {
  return (
    <NavA>
      <Link to={props.to} style={{color: "black", textDecoration: "none"}}>{props.name}</Link>
    </NavA>
  );
};

const LogoutLink = (props) => {
  const history = useHistory();

  const handleClick = () => {
    removeToken(props.setUser, history);
  };

  return <LogoutBtn onClick={handleClick}>{props.name}</LogoutBtn>
};

const Nav = () => {
  const {user, setUser} = useContext(UserContext);

  return (
    <NavWrapper>
      <NavTitle>RacerIn</NavTitle>
      <CustomLink to={`/portfolio/${user.id}`} name="메인" />
      <CustomLink to={"/portfolios"} name="네트워크" />
      {user.id !== 0 && <LogoutLink name="로그아웃" setUser={setUser}/>}
    </NavWrapper>
  );
};

export default Nav;

const NavWrapper = styled.div`
  position: absolute;
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  height: 45px;
`;

const NavTitle = styled.p`
  padding-left: 20px;
  font-size: 27px;
  font-weight: bold;
  margin-right: auto;
`;

const NavA = styled.p`
  cursor: pointer;
  margin-right: 20px;
  font-size: 16px;

  + p {
    padding-left: 20px;
  }
`;

const LogoutBtn = styled.button`
  background-color: white;
  border: none;
  color: black;
  text-decoration: none;
  cursor: pointer;
  margin-right: 20px;
  font-size: 16px;
`;