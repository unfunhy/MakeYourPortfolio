import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { Card } from "../Card";
import SearchBar from "./SearchBar";
import UserBriefUnit from "./UserBriefUnit";

const Network = () => {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  const getUserBriefInfo = async () => {
    try {
      const res = await axios.get("/api/portfolios", {
        params: { page, search, },
      });
      setUserData(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.get("/api/portfolios/profile", {
        params: { page, search, },
      });
      setUserProfile(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserProfile();
    getUserBriefInfo();
  }, []);

  const handleClick = (e, user_id) => {
    history.push(`/portfolio/${user_id}`);
  };

  const handleNextPage = () => {

  };

  const handlePrevPage = () => {

  };

  if (userData.length === 0) return <div>로딩중...</div>;
  else
    return (
      <MainFrame>
        <SearchBar></SearchBar>
        <GridContainer>
          {userData.map((data, index) => {
            return (
              <UserBriefUnit
                key={data.id}
                data={data}
                profile={userProfile[index]}
                handleClick={handleClick}
              />
            );
          })}
        </GridContainer>
      </MainFrame>
    );
};

const MainFrame = styled.div``;

const GridContainer = styled.div`
  display: grid;
  padding-top: 100px;
  grid-template-rows: 1fr 1fr 1fr;
  //grid-template-columns: 1fr 1fr;
`;

const ImgContainer = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 70%;
  margin-top: 15px;
  overflow: hidden;
`;

const RoundImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default Network;
