import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

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
      const res = await axios.get('/api/portfolios', {
        params: { page, search },
      });
      setUserData(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.get('/api/portfolios/profile', {
        params: { page, search },
      });
      setUserProfile(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = () => {
    getUserProfile();
    getUserBriefInfo();
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(getUserData, 700);
    return () => clearTimeout(timer);
  }, [search]);

  const handleClick = (e, user_id) => {
    history.push(`/portfolio/${user_id}`);
  };

  const handleNextPage = () => {};

  const handlePrevPage = () => {};

  return (
    <NetworkWrapper>
      <FlexColumn>
        <NavFrame>
          <SearchBar search={search} setSearch={setSearch} />
        </NavFrame>
        <MainFrame>
          {userData.length !== 0 ? (
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
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                lineHeight: "100%",
              }}
            >
              <Ptag>
                검색결과가 없습니다.
              </Ptag>
            </div>
          )}
        </MainFrame>
      </FlexColumn>
    </NetworkWrapper>
  );
};

const NetworkWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  padding-left: 10px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavFrame = styled.div`
  margin-top: 20px;
  height: 40px;
`;

const MainFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 691px;
  width: 830px;
  box-sizing: border-box;
  padding: 10px;
  background-color: #dad0c2;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 10px;
  padding-bottom: 7px;
  width: 100%;
  height: 100%;
`;

const Ptag = styled.p`
  text-align: center;
  font-size: 30px;
  color: gray;
  padding-bottom: 20px;
`;

export default Network;
