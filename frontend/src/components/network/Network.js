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

  const getUserBriefInfo = async () => {
    try {
      const res = await axios.get('/api/portfolios', {
        params: { page, search },
      });
      setUserData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserBriefInfo();
  }, []);

  useEffect(() => {
    const timer = setTimeout(getUserBriefInfo, 700);
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
  height: auto;
  width: auto;
  min-width: 1130px;
  min-height: 361px;
  box-sizing: border-box;
  padding: 10px;
  background-color: #dad0c2;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 17px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;
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
