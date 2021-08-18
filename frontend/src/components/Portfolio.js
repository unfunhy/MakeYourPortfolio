import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "./UserContext";
import { Card } from "./Card";

const PortfolioWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Portfolio = () => {
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
  const edu_card = useRef();
  const award_card = useRef();
  const pj_card = useRef();
  const cert_card = useRef();

  const draw_content = (data) => {};

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/api/portfolio", {
        params: { id: user.id },
      });
      draw_content(res.data);
    };
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

  return (
    <PortfolioWrapper>
      <Card width="100px" height="120px"></Card>
      <Card width="400px" height="520px"></Card>
    </PortfolioWrapper>
  );
};

export default Portfolio;
