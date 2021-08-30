import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import UserContext from "./components/UserContext";
import Nav from "./components/Nav";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Portfolio from "./components/portfolio/Portfolio";
import Network from "./components/network/Network";
import { getToken, removeToken } from "./components/auth/Auth";

const App = () => {
  const [user, setUser] = useState({ id: 0 });
  const value = { user, setUser };

  const getUser = async () => {
    try {
      const userInfo = await axios.get('/api/login', {
        headers: { Authorization: getToken() },
      });
      setUser({ id: userInfo.data.id, name: userInfo.data.name });
    } catch {
      //올바르지 않은 토큰 삭제
      removeToken(setUser);
    }
  };

  // 토큰 유효성 확인
  useEffect(() => {
    if (getToken()) {
      getUser();
    }
  }, []);

  return (
    <UserContext.Provider value={value}>
      <MainFrame>
        <BrowserRouter>
          <Nav></Nav>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/portfolio/:user_id" component={Portfolio} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/portfolios" component={Network} />
          </Switch>
        </BrowserRouter>
      </MainFrame>
    </UserContext.Provider>
  );
};

export default App;

const MainFrame = styled.div`
  position: relative;
`;