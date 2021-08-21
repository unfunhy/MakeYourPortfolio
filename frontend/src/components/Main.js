import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link, useHistory, Redirect } from 'react-router-dom';
import styled from "styled-components";

import UserContext from "./UserContext";
import Nav from "./Nav";
import Login from "./Login";
import Register from "./Register";
import Portfolio from "./portfolio/Portfolio";
import Network from "./network/Network";

const MainFrame = styled.div`
  position: relative;
  background-color: rgba(223,230,237,255);
  width: 100%;
  height: 100%;
`;

const Main = () => {
  const history = useHistory();
  const [user, setUser] = useState({id:0, name:"방문객"});
  const value = {user, setUser};
  return (
    <UserContext.Provider value={value}>
      <MainFrame>
        <BrowserRouter>
          <Nav></Nav>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/portfolio/:user_id">
              <Portfolio />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/portfolios">
              <Network />
            </Route>
          </Switch>
        </BrowserRouter>
      </MainFrame>
    </UserContext.Provider> 
  );
};

export default Main;
