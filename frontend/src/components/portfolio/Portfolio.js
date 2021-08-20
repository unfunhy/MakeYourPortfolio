import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import { Card } from "../Card";
import Profile from "./Profile";
import * as PortfolioComponent from "./PortfolioDetail";

const PortfolioWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Portfolio = ({ id }) => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState({});

  const draw_content = (data) => {};

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/api/portfolio", {
        params: { id: user.id },
      });
      //draw_content(res.data);
      console.log(res.data);
      setData(res.data);
    };

    fetch();
  }, []);

  const update_profile = () => {};

  const update_introduce = () => {};

  const create_education = () => {};

  const update_education = () => {};

  const create_award = () => {};

  const update_award = () => {};

  const create_project = () => {};

  const update_project = () => {};

  const create_cert = () => {};

  const update_cert = () => {};

  if (data === {}) return <div>로딩 중...</div>;
  else
    return (
      <PortfolioWrapper>
        <Card width="100px" height="120px">
          <Profile
            canEdit={user.id === id}
            data={{
              introduce: data.introduce,
              profile: data.profile,
            }}
            username={user.name} 
          />
        </Card>
        <Card width="400px" height="520px"></Card>
      </PortfolioWrapper>
    );
};

export default Portfolio;
