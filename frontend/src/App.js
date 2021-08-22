import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import styled from "styled-components";

import UserContext from "./components/UserContext";
import Nav from "./components/Nav";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Portfolio from "./components/portfolio/Portfolio";
import Network from "./components/network/Network";

const MainFrame = styled.div`
  position: relative;
  background-color: rgba(223,230,237,255);
  width: 100%;
  height: 100%;
`;

const App = () => {
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
