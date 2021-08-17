import React from "react";
import {Link} from 'react-router-dom';
import styled from "styled-components";

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

const Nav = () => {
  return (
    <NavWrapper>
      <NavTitle>elice</NavTitle>
      <NavA>
        <Link to="" style={{color: "black", textDecoration: "none"}}>메인</Link>
      </NavA>
      <NavA>
        <Link to="" style={{color: "black", textDecoration: "none"}}>네트워크</Link>
      </NavA>
      <NavA>
        <Link to="" style={{color: "black", textDecoration: "none"}}>로그아웃</Link>
      </NavA>
    </NavWrapper>
  );
};

export default Nav;