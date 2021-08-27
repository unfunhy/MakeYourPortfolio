import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import UserContext from "../UserContext";
import { Card } from "../Card";
import { getToken, removeToken } from "../auth/Auth";
import UserInfo from "./UserInfo";
import EducationInfo from "./EducationInfo";
import AwardInfo from "./AwardInfo";
import ProjectInfo from "./ProjectInfo";
import CertificateInfo from "./CertificateInfo";

const Portfolio = (props) => {
  const id = parseInt(props.match.params.user_id);
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({});
  const [validToken, setValidToken] = useState(true);
  const history = useHistory();

  const getData = async () => {
    if (!id || id === 0) return;

    try {
      const res = await axios.get("/api/portfolio", {
        headers: { Authorization: getToken() },
        params: { id: id },
      });
      setData(res.data);
    } catch (e) {
      if (e.response.status === 401) {
        removeToken(setUser, history, 1);
      } else {
        alert(e);
      }
    }
  };

  // Navigation을 통해 portfolio -> portfolio이동 시 데이터 재설정
  useEffect(() => {
    getData();
  }, [id]);

  useEffect(()=> {
    if(!validToken){
      removeToken(setUser, history, 1);
    }
  }, [validToken])

  const setProfileImg = () => {
    getData();
  };

  if (Object.keys(data).length === 0 || user.id === 0)
    return <div>로딩 중...</div>;
  else
    return (
      <PortfolioWrapper>
        <PortfolioMainFrame>
          <UserInfoWrapper>
            <Card width="228px" height="auto" style={{ marginRight: 10 }}>
              <UserInfo
                id={id}
                canEdit={user.id === id}
                data={{
                  introduce: data.user.introduce,
                  profile: data.user.profile,
                  setProfile: setProfileImg,
                }}
                username={data.user.name}
                setValidToken={setValidToken}
              />
            </Card>
          </UserInfoWrapper>
          <DetailInfoWrapper>
            <Card width="600px" height="auto">
              <EducationInfo
                canEdit={user.id === id}
                data={data.education}
                setValidToken={setValidToken}
              />
            </Card>
            <Card width="600px" height="auto">
              <AwardInfo
                canEdit={user.id === id}
                data={data.award}
                setValidToken={setValidToken}
              />
            </Card>
            <Card width="600px" height="auto">
              <ProjectInfo
                canEdit={user.id === id}
                data={data.project}
                setValidToken={setValidToken}
              />
            </Card>
            <Card width="600px" height="auto">
              <CertificateInfo
                canEdit={user.id === id}
                data={data.certificate}
                setValidToken={setValidToken}
              />
            </Card>
          </DetailInfoWrapper>
        </PortfolioMainFrame>
      </PortfolioWrapper>
    );
};

const PortfolioMainFrame = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 888px;
  box-sizing: border-box;
  padding: 10px;
  background-color: #dad0c2;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  //border: 1px solid lightgray;
`;

const PortfolioWrapper = styled.div`
  height: 100%auto;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  padding-left: 10px;
`;

const DetailInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 7px;
`;

const UserInfoWrapper = styled.div``;

export default Portfolio;
