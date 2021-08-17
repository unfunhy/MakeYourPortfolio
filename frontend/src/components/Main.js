import React, { createContext } from "react";
import { BrowserRouter, Route, Switch, Link, useHistory, Redirect } from 'react-router-dom';
import styled from "styled-components";

import Nav from "./Nav";
import Login from "./Login";


const UserContext = createContext();

const MainFrame = styled.div`
  position: relative;
  background-color: rgba(223,230,237,255);
  width: 100%;
  height: 100%;
`;

const Main = () => {
  const history = useHistory();

  return (
    <UserContext.Provider value="방문객">
      <MainFrame>
        <BrowserRouter>
          <Nav></Nav>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/portfolio/:user_id">
              <Login />
            </Route>
            <Route path="/">
              <Login />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </BrowserRouter>
      </MainFrame>
    </UserContext.Provider>
  );
};

export default Main;
